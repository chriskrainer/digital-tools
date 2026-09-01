import assert from "node:assert/strict";

const baseUrl = process.env.RETAINED_CHECK_BASE_URL ?? "http://127.0.0.1:5000";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...options,
  });

  return response;
}

async function expectStatus(path, expectedStatus) {
  const response = await request(path);
  assert.equal(
    response.status,
    expectedStatus,
    `${path} returned ${response.status}; expected ${expectedStatus}`,
  );
  console.log(`PASS ${path} (${response.status})`);
  return response;
}

async function expectJsonArray(path) {
  const response = await expectStatus(path, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body), `${path} must return a JSON array`);
  return body;
}

async function run() {
  console.log(`Checking retained Digital Tools at ${baseUrl}`);
  console.log("This check performs read-only requests and does not follow tracking redirects.");

  for (const path of [
    "/",
    "/dqm",
    "/dqm/instructions",
    "/utm-builder",
    "/utm-builder/instructions",
  ]) {
    const response = await expectStatus(path, 200);
    const contentType = response.headers.get("content-type") ?? "";
    assert.match(contentType, /text\/html/, `${path} must return HTML`);
  }

  const authResponse = await expectStatus("/api/auth/check", 200);
  const authBody = await authResponse.json();
  assert.equal(
    typeof authBody.passwordRequired,
    "boolean",
    "/api/auth/check must return passwordRequired as a boolean",
  );

  const qrCodes = await expectJsonArray("/api/qrcodes");
  if (qrCodes.length > 0) {
    const qrCode = qrCodes[0];
    assert.equal(typeof qrCode.id, "string", "QR records must have string IDs");
    assert.equal(typeof qrCode.redirectUrl, "string", "QR records must have redirect URLs");

    const imageResponse = await expectStatus(
      `/api/qrcodes/${encodeURIComponent(qrCode.id)}/image`,
      200,
    );
    const imageBody = await imageResponse.json();
    assert.match(
      imageBody.image ?? "",
      /^data:image\/png;base64,/,
      "QR image endpoint must return a PNG data URL",
    );
  } else {
    console.log("SKIP QR image check (no QR records)");
  }

  await expectStatus("/r/__retained_check_missing__", 404);

  const campaigns = await expectJsonArray("/api/utm-campaigns");
  for (const campaign of campaigns) {
    assert.equal(typeof campaign.id, "string", "UTM campaigns must have string IDs");
    assert.equal(typeof campaign.shortCode, "string", "UTM campaigns must have short codes");
    assert.equal(typeof campaign.fullUrl, "string", "UTM campaigns must have full URLs");
  }

  await expectStatus("/c/__retained_check_missing__", 404);

  console.log("All retained Digital Tools checks passed.");
}

run().catch((error) => {
  console.error("Retained Digital Tools check failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
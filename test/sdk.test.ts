import { assertEquals, assertThrows } from "jsr:@std/assert";
import WhatsApp from "../src/sdk/mod.ts";
import { PartialWAConfigType } from "../src/sdk/types/config.ts";

function createWhatsApp(env?: PartialWAConfigType) {
    return new WhatsApp(env);
}

Deno.test("should throw on missing required environment variables", () => {
    assertThrows(() =>
        createWhatsApp({
            CLOUD_API_ACCESS_TOKEN: "fake-access-token",
            CLOUD_API_VERSION: "fake-api-version",
        })
    );
    assertThrows(() =>
        createWhatsApp({
            CLOUD_API_ACCESS_TOKEN: "fake-access-token",
            WA_PHONE_NUMBER_ID: 12345678,
        })
    );
    assertThrows(() =>
        createWhatsApp({
            CLOUD_API_VERSION: "fake-api-version",
            WA_PHONE_NUMBER_ID: 12345678,
        })
    );
    assertThrows(() =>
        createWhatsApp({
            CLOUD_API_ACCESS_TOKEN: "",
            CLOUD_API_VERSION: "",
            WA_PHONE_NUMBER_ID: 12345678,
        })
    );
});

Deno.test("should set required configs", () => {
    const sdk = createWhatsApp({
        CLOUD_API_ACCESS_TOKEN: "fake-access-token",
        CLOUD_API_VERSION: "fake-api-version",
        WA_PHONE_NUMBER_ID: 12345678,
    });

    assertEquals(sdk.config.CLOUD_API_ACCESS_TOKEN, "fake-access-token");
    assertEquals(sdk.config.CLOUD_API_VERSION, "fake-api-version");
    assertEquals(sdk.config.WA_PHONE_NUMBER_ID, 12345678);
});

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amountFils,
      currency = "AED",
      description = "Booking",
      metadata = {},
      successUrl,
      cancelUrl,
    } = body || {};



    //fwefwefwefewfweffwefwefwe

    // Enhanced validation
    if (!body || typeof body !== "object") {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          code: "INVALID_BODY",
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (!amountFils || typeof amountFils !== "number" || amountFils <= 0) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid amount. Please provide a valid amount greater than 0.",
          code: "INVALID_AMOUNT",
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (amountFils < 100) {
      // Minimum 1 AED (100 fils)
      return new Response(
        JSON.stringify({
          error: "Amount too small. Minimum amount is 1 AED.",
          code: "AMOUNT_TOO_SMALL",
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Mock mode to unblock local testing when upstream is unavailable
    if (process.env.ZIINA_MOCK === "true") {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const fakeRedirect = `${appUrl}/thank-you?mock=true&amount=${amountFils}&tourId=${
        metadata.tourId || "unknown"
      }`;
      return new Response(
        JSON.stringify({
          redirectUrl: fakeRedirect,
          id: "mock_intent_123",
          status: "requires_payment_method",
          message: "Mock payment mode - redirecting to success page",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    }

    if (!process.env.ZIINA_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Payment service configuration error. Please contact support.",
          code: "MISSING_API_KEY",
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const apiBase = process.env.ZIINA_API_BASE || "https://api.ziina.com";
    const intentPath =
      process.env.ZIINA_PAYMENT_INTENT_PATH || "/payment_intent"; // adjust if docs require "/v1/payment_intents"

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const success = successUrl || `${appUrl}/thank-you`;
    const cancel = cancelUrl || `${appUrl}/payment-cancelled`;

    const response = await fetch(`${apiBase}${intentPath}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.ZIINA_API_KEY}`,
      },
      body: JSON.stringify({
        amount: amountFils,
        currency_code: currency,
        success_url: success,
        cancel_url: cancel,
        description,
        metadata,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage =
        "Payment service temporarily unavailable. Please try again.";
      let errorCode = "PAYMENT_SERVICE_ERROR";

      if (response.status === 401) {
        errorMessage =
          "Payment service authentication failed. Please contact support.";
        errorCode = "AUTH_ERROR";
      } else if (response.status === 400) {
        errorMessage =
          "Invalid payment request. Please check your details and try again.";
        errorCode = "INVALID_REQUEST";
      } else if (response.status >= 500) {
        errorMessage =
          "Payment service is currently experiencing issues. Please try again later.";
        errorCode = "SERVICE_UNAVAILABLE";
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
          code: errorCode,
          details: errText,
        }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const data = await response.json();

    const redirectUrl = data.redirect_url || data.url || data.checkout_url;
    if (!redirectUrl) {
      return new Response(
        JSON.stringify({
          error:
            "Payment service did not provide a redirect URL. Please try again.",
          code: "MISSING_REDIRECT_URL",
          data,
        }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        redirectUrl,
        id: data.id,
        status: data.status,
        message: "Payment intent created successfully",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment API Error:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";
    let errorCode = "UNKNOWN_ERROR";

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      errorMessage =
        "Unable to connect to payment service. Please check your internet connection and try again.";
      errorCode = "NETWORK_ERROR";
    } else if (error.name === "SyntaxError") {
      errorMessage = "Invalid response from payment service. Please try again.";
      errorCode = "INVALID_RESPONSE";
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        code: errorCode,
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

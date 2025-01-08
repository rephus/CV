async function getVisitorInfo() {
    // Collect basic browser information
    const visitorInfo = {
      //url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      mobile: navigator.userAgent.match(/Mobile/i) ? "Yes" : "No",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };

    // Attempt to fetch location using a public IP geolocation API
    try {
      const locationResponse = await fetch("https://ipapi.co/json/");
      const locationData = await locationResponse.json();

      visitorInfo.location = {
        city: locationData.city,
        region: locationData.region,
        country: locationData.country_name,
        ip: locationData.ip,
      };
    } catch (error) {
      visitorInfo.location = "Failed to retrieve location.";
    }

    // Prepare Slack payload
    const slackPayload = {
      text: `New visitor on your http://rengel.me !`,
      attachments: [
        {
          fields: Object.keys(visitorInfo).map((key) => ({
            title: key,
            value: typeof visitorInfo[key] === "object" ? JSON.stringify(visitorInfo[key]) : visitorInfo[key],
            short: false,
          })),
        },
      ],
    };

    // Send data to Slack
    try {
      await fetch("https://hooks.slack.com/services/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", {
        method: "POST",
        //headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackPayload),
      });
    } catch (error) {
      console.error("Error sending data to Slack:", error);
    }
  }

  // Trigger the function when the page loads
  getVisitorInfo();
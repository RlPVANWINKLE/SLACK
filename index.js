require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");
const signingSecret = process.env["SLACK_SIGNING_SECRET"];
const botToken = process.env["SLACK_BOT_TOKEN"];
const app = new App({
  signingSecret: signingSecret,
  token: botToken,
});

(async () => {
  await app.start(process.env.PORT || 12000);
  app.message(async ({ message, say }) => {
    if (message.text == "Emulators") {
      await say({
        blocks: [
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "TA200",
                },
                url: "https://ta200.netlify.app/",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "FaceID5",
                },
                url: "https://faceid5.netlify.app/",
              },
            ],
          },
        ],
      });
    } else {
      let resp = await axios.get(
        `https://wmzeeupjd57owgpb2hjeciiq5e0huipa.lambda-url.us-east-2.on.aws/slacky/${message.text}`,
      );

      let quote = resp.data;
      if (quote.length < 1) {
        await say("Sorry, I dont see anything that matches that");
      }
      for (let i = 0; i < quote.length; i++) {
        await say({
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: `${quote[i].header}`,
              },
            },
            {
              type: "rich_text",
              elements: [
                {
                  type: "rich_text_preformatted",
                  elements: [
                    {
                      type: "text",
                      text: `${quote[i].description}`,
                    },
                  ],
                },
              ],
            },
          ],
        });
      }
    }
  });
  console.log("Bolt app is running on 12000!");
})();

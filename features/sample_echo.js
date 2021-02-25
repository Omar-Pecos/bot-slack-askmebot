/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function (controller) {
  controller.hears("ping", "message,direct_message", async (bot, message) => {
    await bot.reply(message, "PONG");
  });

  /* 
    controller.on('message,direct_message', async(bot, message) => {
        await bot.reply(message, `Echo: ${ message.text }`);
    });
*/
};

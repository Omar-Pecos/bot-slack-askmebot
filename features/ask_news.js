const axios = require('axios').default;
const cheerio = require('cheerio');
const URL_NEWS = process.env.URL_NEWS;
const img_default_url = 'https://progestion.org/wp-content/uploads/2017/05/default-img-300x225.jpg';

let paramString = '';

const isNewsCommand = (msgSplitted) => {

  let value = false;

  const [command, param] = msgSplitted.filter((val) => val != '');

  if (command == 'news') {
    value = true;
    paramString = param;
  }

  return value;
};

const getCounterValue = () =>{
  let value;
  value =  parseInt(paramString) > 0 && parseInt(paramString) < 48 ? parseInt(paramString) : 47;
  return value;
}

module.exports = (controller) =>{
 controller.hears(
    async (message) =>
      message.text && isNewsCommand(message.text.split('!')),
    ['message', 'direct_message'],
    async (bot, message) => {

      let counter = getCounterValue();

      const { data } = await axios.get(URL_NEWS,{
        responseType : 'arraybuffer'
      });
      const html = data.toString('latin1');
      const $ = cheerio.load(html);

      let response = {
        blocks: [],
      };
      let content = [];

      const sections = $("article.cell").get();

      for(i = 0; i + 1 <= counter; i++){
          if(i == 0 && sections.length < counter) counter = sections.length;

            const $cell = $(sections[i]);
            const $mediaBox = $cell.find(".mediaBox.noticBox img");
            const img = $mediaBox.attr("src") || img_default_url;
            const $link = $cell.find("div.txtBox a");
            const title = $link.attr("title");
            const href = $link.attr("href");

            content.push({
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*" + title + "*\n" + href,
              },
              accessory: {
                type: "image",
                image_url: img,
                alt_text: title,
              },
            });
      }

      content.unshift(
         {
            type: 'header',
            text: {
              type: 'plain_text',
              text: ':ghost: Últimas noticias :ghost:',
              emoji: true,
            },
          },
          {
            type : 'divider'
          }
      );

      content.push({
            type : 'divider'
      });

      response.blocks = content;

       await bot.startPrivateConversation(message.user);
       await bot.say(response);
    });
}
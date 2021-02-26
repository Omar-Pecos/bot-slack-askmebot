const axios = require('axios').default;

const baseURL = (process.env.NODE_ENV = 'development'
  ? process.env.API_APM_URL_LOCAL
  : process.env.API_APM_URL_PROD);
const URL = baseURL + '/api/v1/apm';

let param = '';

const isApmCommand = (msgSplitted) => {
  let value = false;
  const [command, parameter] = msgSplitted.filter((val) => val != '');

  if (command == 'apm') {
    value = true;
    param = parameter;
  }

  return value;
};

const getParams = () => {
  let value = '0';

  if (param) {
    value = param;
  }

  return value;
};

module.exports = (controller) => {
  controller.hears(
    '!apm_commands',
    'message,direct_message',
    async (bot, message) => {
      let res = {
        attachments: [
          {
            blocks: [],
          },
        ],
      };

      //get apms
      const {
        data: { data: rows },
      } = await axios.get(URL);

      //fill res
      let content = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'APM commands :ghost:',
            emoji: true,
          },
        },
      ];

      rows.map((apm) => {
        content.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              '*' +
              apm.name +
              '* \t' +
              apm.url +
              ' \n ' +
              (apm.desc ? apm.desc : 'Sin descripción') +
              '\n *!apm!' +
              apm.command +
              '*',
          },
        });
      });

      res.attachments[0].blocks = [...content];
      await bot.startPrivateConversation(message.user);
      await bot.deleteMessage(message.id);
      await bot.say(res);
    }
  );
  controller.hears(
    async (message) => message.text && isApmCommand(message.text.split('!')),
    ['message', 'direct_message'],
    async (bot, message) => {
      let value = getParams();

      await bot.changeContext(message.reference);
      //res from api
      axios
        .get(URL + '/find/' + value)
        .then(async (res) => {
          //need auth the bot to delete other user message
          //await bot.deleteMessage(message.incoming_message);
          await bot.reply(message, res.data.data.url);
        })
        .catch(async (err) => {
          console.log(err);
          //await bot.deleteMessage(message.incoming_message);
          await bot.reply(message, 'Something failed, sorry :(');
        });
    }
  );
};

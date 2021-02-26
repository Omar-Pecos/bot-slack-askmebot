const axios = require('axios').default;

let paramsString = '';

const isUnsplashCommand = (msgSplitted) => {
  let value = false;
  const [command, params] = msgSplitted.filter((val) => val != '');

  if (command == 'img') {
    value = true;
    commandAsked = command;
    paramsString = params;
  }

  return value;
};

const getParams = () => {
  let value = {
    search: '',
    width: null,
    height: null,
  };

  if (paramsString) {
    let arr = paramsString.split(',');
    value.search = arr[0];
    value.width = arr[1];
    value.height = arr[2];
  }

  return value;
};

module.exports = (controller) => {
  controller.hears(
    async (message) =>
      message.text && isUnsplashCommand(message.text.split('!')),
    ['message', 'direct_message'],
    async (bot, message) => {
      let values = getParams();

      let url = 'https://source.unsplash.com/random';

      //only a search term - random?water
      if (values.search) {
        url += values[0];
      }

      //full 3 terms search - .com/widthxheight/?water
      if (values.search && values.width && values.height) {
        url = `https://source.unsplash.com/${values.width}x${values.height}/?${values.search}`;
      }

      axios
        .get(url)
        .then(async (response) => {
          //success = true;
          await bot.startPrivateConversation(message.user);
          await bot.say(response.request._redirectable._options.href);
        })
        .catch(async (error) => {
          console.log(error);
          //fallback
          await bot.say('https://source.unsplash.com/daily');
        });
    }
  );
};

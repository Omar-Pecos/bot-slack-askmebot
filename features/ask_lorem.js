//!lorem
//!lorem!2

const validCommands = ['lorem', 'kafka', 'ciceron'];

const lorem = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
];

const kafka = [
  'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.',
  "The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. 'What's happened to me? ' he thought. It wasn't a dream.",
  'His room, a proper human room although a little too small, lay peacefully between its four familiar walls. A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat upright, raising a heavy fur muff that covered the whole of her lower arm towards the viewer. Gregor then turned to look out the window at the dull weather. Drops',
];

const ciceron = [
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere',
];

let commandAsked = '';
let paramsString = '';

const isLoremCommand = (msgSplitted) => {
  let value = false;
  const [command, params] = msgSplitted.filter((val) => val != '');

  if (validCommands.includes(command)) {
    value = true;
    commandAsked = command;
    paramsString = params;
  }

  return value;
};

const getParams = () => {
  let value = 1;

  if (paramsString) {
    value = parseInt(paramsString);
  }

  return value;
};

module.exports = (controller) => {
  controller.hears(
    async (message) => message.text && isLoremCommand(message.text.split('!')),
    ['message', 'direct_message'],
    async (bot, message) => {
      value = getParams();

      let arr;
      let res = {
        attachments: [
          {
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: '',
                  emoji: true,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'plain_text',
                  text: '',
                  emoji: true,
                },
              },
            ],
          },
        ],
      };

      switch (commandAsked) {
        case 'lorem':
          arr = lorem;
          res.attachments[0].blocks[0].text.text =
            'Here you have some lorem! :ghost:';

          break;
        case 'kafka':
          arr = kafka;
          res.attachments[0].blocks[0].text.text =
            'You look so smart today ... :ghost:';
          break;
        case 'ciceron':
          arr = ciceron;
          res.attachments[0].blocks[0].text.text =
            'If you are reading this, have a good day! ... :ghost:';
          break;
        default:
          arr = lorem;
      }

      let content = '';
      arr.map((paragraph) => {
        if (value > 0) {
          content += paragraph + '\n';
          value--;
        }
      });

      //asign content to final res
      res.attachments[0].blocks[1].text.text = content;

      await bot.startPrivateConversation(message.user);
      await bot.say(res);
    }
  );
};

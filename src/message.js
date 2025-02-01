import { getRandomIcon } from 'icon';

export const serializeMessagesWithQuickReply = (texts) => {
  const messages = texts.map((text, index) => {
    const isLastElement = (idx) => idx === texts.length - 1;

    let message = { type: 'text', text };
    if (isLastElement(index)) {
      message = {
        ...message,
        quickReply: {
          items: _quickReplyItems(),
        },
      };
    }
    return message;
  });

  return messages;
};

const _quickReplyItems = () => {
  return [
    {
      type: 'action',
      action: {
        type: 'message',
        label: `${getRandomIcon()} 今日書いたこと`,
        text: '今日書いたこと',
      },
    },
  ];
};

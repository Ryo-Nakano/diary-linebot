const getRandomIcon = () => {
  const icons = [
    '📗', '📕', '📘', '📚', '📙', '📖', '🗒', '📄', '✍️', '📝',
    '🌱', '🌲', '🌴', '🍁', '🍜', '🍇', '🍑', '🍎', '🍊', '🍆',
    '🍠', '🍄', '🥒', '🥕', '🐰', '🐓', '🐣', '🐈', '🐞', '🐛',
    '🚀', '🛴', '✈️', '🚗', '🚤', '🍖', '🍢', '🍣', '🍔', '🌞',
    '🌀', '🏃‍♂️', '🎾', '🏊‍♀️', '⛳️', '🏐', '🏄‍♀️', '🏀', '🏓',
    '🏸', '⚽️', '🦍', '🐴', '🐼', '🐻‍❄️'
  ];
  const icon = icons[_getRandomNum(0, icons.length - 1)];
  return icon;
};

const _getRandomNum = (min, max) => {
  const num = Math.floor(Math.random() * (max + 1 - min)) + min;
  return num;
};

export { getRandomIcon };

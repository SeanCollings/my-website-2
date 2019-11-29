export const testOutOfBounds = () => {
  const outOfBounds = { left: null, top: null, right: null, bottom: null };
  const dice = document.getElementById('dice');
  const cube1 = document.getElementById('cube-1');

  if (!dice || !cube1) return null;

  const front = document.getElementById('front');
  const back = document.getElementById('back');
  const right = document.getElementById('right');
  const left = document.getElementById('left');
  const top = document.getElementById('top');
  const bottom = document.getElementById('bottom');

  const diceBounds = dice.getBoundingClientRect();
  const frontBounds = front.getBoundingClientRect();
  const backBounds = back.getBoundingClientRect();
  const rightBounds = right.getBoundingClientRect();
  const leftBounds = left.getBoundingClientRect();
  const topBounds = top.getBoundingClientRect();
  const bottomBounds = bottom.getBoundingClientRect();

  outOfBounds.left = testLessThanBounds(
    diceBounds.left,
    frontBounds.left,
    backBounds.left,
    rightBounds.left,
    leftBounds.left,
    topBounds.left,
    bottomBounds.left
  );
  outOfBounds.top = testLessThanBounds(
    diceBounds.top,
    frontBounds.top,
    backBounds.top,
    rightBounds.top,
    leftBounds.top,
    topBounds.top,
    bottomBounds.top
  );
  outOfBounds.right = testMoreThanBounds(
    diceBounds.right,
    frontBounds.right,
    backBounds.right,
    rightBounds.right,
    leftBounds.right,
    topBounds.right,
    bottomBounds.right
  );
  outOfBounds.bottom = testMoreThanBounds(
    diceBounds.bottom,
    frontBounds.bottom,
    backBounds.bottom,
    rightBounds.bottom,
    leftBounds.bottom,
    topBounds.bottom,
    bottomBounds.bottom
  );

  return outOfBounds;
};

const testLessThanBounds = (dice, front, back, right, left, top, bottom) => {
  return (
    front <= dice ||
    back <= dice ||
    right <= dice ||
    left <= dice ||
    top <= dice ||
    bottom <= dice
  );
};

const testMoreThanBounds = (dice, front, back, right, left, top, bottom) => {
  return (
    front >= dice ||
    back >= dice ||
    right >= dice ||
    left >= dice ||
    top >= dice ||
    bottom >= dice
  );
};

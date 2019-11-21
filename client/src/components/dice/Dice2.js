import React, { useEffect } from 'react';
import './dice2.css';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {}
});

// const

// const slide = (x,y,z) => {
// return `translateX() translate`
// }

// const test = async randomRotate => {
//   const transform = await new Promise(res => {
//     setTimeout(() => {
//       res(`rotateX(90deg) rotateY(${randomRotate}deg) rotate(90deg)`);
//     }, 1000);
//   });
//   console.log('transform', transform);
//   return transform;
//   // const test = await Promise.all([setTimeout(() => 'rotateY(100deg)', 1000)]);
//   // console.log('test', test);
//   // return test;
//   // return `rotateY(${randomRotate}deg)`;
// };

const showFace = (randomFace, randomRotate, randomSpins) => {
  // console.log(randomFace);
  const spinDegrees = 360 * randomSpins;
  let newFace = '';

  switch (randomFace) {
    case 1:
      newFace = `rotateX(${spinDegrees}deg) rotateY(${-spinDegrees}deg) rotate(${randomRotate}deg)`;
      break;
    case 2:
      newFace = `rotateX(${spinDegrees +
        180}deg) rotateY(${spinDegrees}deg) rotate(${randomRotate}deg)`;
      break;
    case 3:
      newFace = `rotateX(${spinDegrees +
        90}deg) rotateY(${randomRotate}deg) rotate(${spinDegrees + 90}deg)`;
      break;
    case 4:
      newFace = `rotateX(${spinDegrees +
        270}deg) rotateY(${randomRotate}deg) rotate(${spinDegrees + 90}deg)`;
      break;
    case 5:
      newFace = `rotateX(${spinDegrees + 270}deg) rotateY(${randomRotate}deg)`;
      break;
    case 6:
      newFace = `rotateX(${spinDegrees + 90}deg) rotateY(${randomRotate}deg)`;
      break;
    default:
      newFace = `rotateX(0deg) rotateY(0deg) rotate(0deg)`;
      break;
    // case 1:
    //   return `rotateX(0deg) rotateY(0deg) rotate(${randomRotate}deg)`;
    // case 2:
    //   return `rotateX(180deg) rotateY(0deg) rotate(${randomRotate}deg)`;
    // case 3:
    //   return `rotateX(90deg) rotateY(${randomRotate}deg) rotate(90deg)`;
    // case 4:
    //   return `rotateX(270deg) rotateY(${randomRotate}deg) rotate(90deg)`;
    // case 5:
    //   return `rotateX(270deg) rotateY(${randomRotate}deg)`;
    // case 6:
    //   return `rotateX(90deg) rotateY(${randomRotate}deg)`;
    // default:
    //   return `rotateX(0deg) rotateY(0deg) rotate(0deg)`;
  }

  return newFace;
};

const Dice = ({
  cube,
  position,
  randomFace,
  randomRotate,
  diceMounted,
  randomSpins
}) => {
  useEffect(() => {
    diceMounted();
  }, [diceMounted]);

  return (
    <div
      id={'cube-1'}
      className={`cube`}
      cube={cube}
      face={randomFace}
      // data-roll={'show-2'}
      style={{
        top: `${position[0]}`,
        left: `${position[1]}`,
        transform: showFace(randomFace, randomRotate, randomSpins)
        // transform: animate ? animate : showFace(randomFace, randomRotate)
      }}
    >
      <div id="front" className="side front" data-side="1">
        <span className="dot"></span>
      </div>
      <div id="back" className="side back" data-side="2">
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div id="right" className="side right" data-side="3">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div id="left" className="side left" data-side="4">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div id="top" className="side top" data-side="5">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <div id="bottom" className="side bottom" data-side="6">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default withStyles(styles)(Dice);

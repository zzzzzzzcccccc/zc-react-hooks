import { renderHook } from '@testing-library/react-hooks';
import useEventOutside from '../index';

describe('test useEventOutside', () => {
  let domA: HTMLDivElement;
  let domB: HTMLDivElement;
  let containerA: HTMLDivElement;
  let containerB: HTMLDivElement;

  beforeEach(() => {
    domA = document.createElement('div');
    domB = document.createElement('div');
    containerA = document.createElement('div');
    containerB = document.createElement('div');

    document.body.appendChild(domA);
    document.body.appendChild(domB);
    document.body.appendChild(containerA);
    document.body.appendChild(containerB);
  });

  afterEach(() => {
    document.body.removeChild(domA);
    document.body.removeChild(domB);
    document.body.removeChild(containerA);
    document.body.removeChild(containerB);
  });

  it('should be work', () => {
    let num = 0;
    const hook = renderHook(() => {
      useEventOutside([containerA, containerB], ['click', 'contextmenu'], (e) => {
        num++;
      });
    });

    hook.rerender();

    containerA.click();
    containerB.click();
    expect(num).toEqual(0);

    domA.click();
    domB.click();
    expect(num).toEqual(2);
  });
});

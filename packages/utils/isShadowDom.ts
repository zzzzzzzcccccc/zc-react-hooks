import { Target } from './getElement';

export default function isShadowDom(target: Target<Element | Document | ShadowRoot>) {
  return target instanceof DocumentFragment;
}

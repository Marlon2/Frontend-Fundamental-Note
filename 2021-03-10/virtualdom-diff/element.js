import {
  isObject,
  isString,
  isArray,
  isNotEmptyObj,
  objForEach,
  aryForEach
} from "./util.js";
import { NOKEY } from "./common.js";

class Element {
  constructor(tagName, props, children) {
    // 解析参数
    this.tagName = tagName;
    // 字段处理,可省略参数
    this.props = isObject(props) ? props : {};
    this.children =
      children ||
      (!isNotEmptyObj(this.props) &&
        ((isString(props) && [props]) || (isArray(props) && props))) ||
      [];
    // 无论void后的表达式是什么，void操作符都会返回undefined
    this.key = props ? props.key : void NOKEY;

    // 计算节点数
    let count = 0;
    aryForEach(this.children, (item, index) => {
      if (item instanceof Element) {
        count += item.count;
      } else {
        this.children[index] = "" + item;
      }
      count ++;
    })
    this.count = count;
  }

  render() {
    // 根据tagName构建
    const dom = document.createElement(this.tagName);

    // 设置props
    objForEach(this.props, propName => {
      dom.setAttribute(propName, this.props[propName]);
    })

    // 渲染children
    aryForEach(this.children, child => {
      const childDom = child instanceof Element ? child.render() : document.createTextNode(child);
      dom.appendChild(childDom)
    });
    return dom;
  }
}

export default function CreateElement(tagName, props, children) {
  return new Element(tagName, props, children);
}
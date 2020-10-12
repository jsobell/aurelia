import { IIndexable } from '@aurelia/kernel';
import {
  IAccessor,
  LifecycleFlags,
  ITask,
  AccessorType,
} from '@aurelia/runtime';

/**
 * Property accessor for HTML Elements.
 * Note that Aurelia works with properties, so in all case it will try to assign to property instead of attributes.
 * Unless the property falls into a special set, then it will use attribute for it.
 *
 * @see DataAttributeAccessor
 */
export class ElementPropertyAccessor implements IAccessor {
  public task: ITask | null = null;
  // ObserverType.Layout is not always true, it depends on the property
  // but for simplicity, always treat as such
  public type: AccessorType = AccessorType.Node | AccessorType.Layout;

  public getValue(obj: HTMLElement, key: string): unknown {
    return (obj as IIndexable<HTMLElement>)[key]
  }

  public setValue(newValue: unknown, flags: LifecycleFlags, obj: HTMLElement, key: string): void {
    (obj as IIndexable<HTMLElement>)[key] = newValue;
  }
}

export const elementPropertyAccessor = new ElementPropertyAccessor();

import { LifecycleFlags, PropertyBinding, bindingBehavior, AccessorOrObserver } from '@aurelia/runtime';
import { dataAttributeAccessor } from '../../observation/data-attribute-accessor';

import type { Scope } from '@aurelia/runtime';

@bindingBehavior('attr')
export class AttrBindingBehavior {
  public bind(flags: LifecycleFlags, _scope: Scope, _hostScope: Scope | null, binding: PropertyBinding): void {
    binding.targetObserver = dataAttributeAccessor as AccessorOrObserver;
  }

  public unbind(flags: LifecycleFlags, _scope: Scope, _hostScope: Scope | null, binding: PropertyBinding): void {
    return;
  }
}

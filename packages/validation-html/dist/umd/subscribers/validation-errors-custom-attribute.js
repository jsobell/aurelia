var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/runtime-html", "../validation-controller", "./common", "@aurelia/kernel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValidationErrorsCustomAttribute = void 0;
    const runtime_html_1 = require("@aurelia/runtime-html");
    const validation_controller_1 = require("../validation-controller");
    const common_1 = require("./common");
    const kernel_1 = require("@aurelia/kernel");
    /**
     * A validation errors subscriber in form of a custom attribute.
     *
     * It registers itself as a subscriber to the validation controller available for the scope.
     * The target controller can be bound via the `@bindable controller`; when omitted it takes the controller currently registered in the container.
     *
     * The set of errors related to the host element or the children of it , are exposed via the `@bindable errors`.
     *
     * @example
     * ```html
     * <div id="div1" validation-errors.bind="nameErrors">
     *   <input id="target1" type="text" value.two-way="person.name & validate">
     *   <span class="error" repeat.for="errorInfo of nameErrors">
     *     ${errorInfo.result.message}
     *   </span>
     * </div>
     * ```
     */
    let ValidationErrorsCustomAttribute = class ValidationErrorsCustomAttribute {
        constructor(host, scopedController) {
            this.scopedController = scopedController;
            this.errors = [];
            this.errorsInternal = [];
            this.host = host;
        }
        handleValidationEvent(event) {
            for (const { result } of event.removedResults) {
                const index = this.errorsInternal.findIndex((x) => x.result === result);
                if (index !== -1) {
                    this.errorsInternal.splice(index, 1);
                }
            }
            for (const { result, targets: elements } of event.addedResults) {
                if (result.valid) {
                    continue;
                }
                const targets = elements.filter((e) => this.host.contains(e));
                if (targets.length > 0) {
                    this.errorsInternal.push(new validation_controller_1.ValidationResultTarget(result, targets));
                }
            }
            this.errorsInternal.sort((a, b) => {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                return common_1.compareDocumentPositionFlat(a.targets[0], b.targets[0]);
            });
            this.errors = this.errorsInternal;
        }
        beforeBind() {
            var _a;
            this.controller = (_a = this.controller) !== null && _a !== void 0 ? _a : this.scopedController;
            this.controller.addSubscriber(this);
        }
        beforeUnbind() {
            this.controller.removeSubscriber(this);
        }
    };
    __decorate([
        runtime_html_1.bindable,
        __metadata("design:type", Object)
    ], ValidationErrorsCustomAttribute.prototype, "controller", void 0);
    __decorate([
        runtime_html_1.bindable({ primary: true, mode: runtime_html_1.BindingMode.twoWay }),
        __metadata("design:type", Array)
    ], ValidationErrorsCustomAttribute.prototype, "errors", void 0);
    ValidationErrorsCustomAttribute = __decorate([
        runtime_html_1.customAttribute('validation-errors'),
        __param(0, runtime_html_1.INode),
        __param(1, kernel_1.optional(validation_controller_1.IValidationController)),
        __metadata("design:paramtypes", [Object, Object])
    ], ValidationErrorsCustomAttribute);
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});
//# sourceMappingURL=validation-errors-custom-attribute.js.map
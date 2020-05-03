import { DebugConfiguration } from '@aurelia/debug';
import { IHTMLRouter, RouterConfiguration } from '@aurelia/router-html';
import { Aurelia, CustomElement } from '@aurelia/runtime';
import { assert, TestContext } from '@aurelia/testing';
import { TestRouterConfiguration } from './configuration';

describe('Nav', function () {
  async function createFixture(component) {
    const ctx = TestContext.createHTMLTestContext();
    const container = ctx.container;
    container.register(TestRouterConfiguration.for(ctx));

    const App = CustomElement.define({ name: 'app', template: `<template><au-viewport name="app" used-by="${component}" default="${component}"></au-viewport></template>` });
    const Foo = CustomElement.define({ name: 'foo', template: '<template>Nav: foo <au-nav name="main-nav"></au-nav></template>' }, class {
      public static inject = [IHTMLRouter];
      public constructor(private readonly r: IHTMLRouter) { }
      public enter() { this.r.setNav('main-nav', [{ title: 'Bar', route: 'bar' }]); }
    });
    const Bar = CustomElement.define({ name: 'bar', template: '<template>Nav: bar <au-nav name="main-nav"></au-nav><au-viewport name="main-viewport" default="baz"></au-viewport></template>' }, class {
      public static inject = [IHTMLRouter];
      public constructor(private readonly r: IHTMLRouter) { }
      public enter() { this.r.setNav('main-nav', [{ title: 'Baz', route: 'baz' }]); }
    });
    const Baz = CustomElement.define({ name: 'baz', template: '<template>Baz</template>' }, class { });
    const Qux = CustomElement.define({ name: 'qux', template: '<template>Nav: qux <au-nav name="main-nav"></au-nav><au-viewport name="main-viewport" default="baz"></au-viewport></template>' }, class {
      public static inject = [IHTMLRouter];
      public constructor(private readonly r: IHTMLRouter) { }
      public enter() {
        this.r.addNav('main-nav', [{ title: 'Baz', route: Baz, children: [{ title: 'Bar', route: ['bar', Baz] }] }, { title: 'Foo', route: { component: Foo, viewport: 'main-viewport' } }]);
      }
    });

    const host = ctx.doc.createElement('div');
    ctx.doc.body.appendChild(host);

    const au = new Aurelia(container)
      .register(DebugConfiguration, RouterConfiguration)
      .app({ host: host, component: App });

    const router = container.get(IHTMLRouter);

    container.register(Foo, Bar, Baz, Qux);

    await au.start().wait();

    async function tearDown() {
      router.deactivate();
      await au.stop().wait();
      ctx.doc.body.removeChild(host);
    }

    const scheduler = ctx.scheduler;

    return { au, container, host, router, ctx, tearDown, scheduler };
  }

  it('generates nav with a link', async function () {
    this.timeout(5000);
    const { host, router, tearDown, scheduler } = await createFixture('foo');

    await scheduler.yieldAll();

    assert.includes(host.innerHTML, 'foo', `host.innerHTML`);
    assert.includes(host.innerHTML, 'Bar', `host.innerHTML`);
    assert.includes(host.innerHTML, 'href="bar"', `host.innerHTML`);
    assert.notIncludes(host.innerHTML, 'nav-active', `host.innerHTML`);
    await tearDown();
  });

  it('generates nav with an active link', async function () {
    this.timeout(5000);
    const { host, router, tearDown, scheduler } = await createFixture('bar');
    router.activeComponents = [router.createViewportInstruction('baz', 'main-viewport')];

    await scheduler.yieldAll();

    assert.includes(host.innerHTML, 'href="baz"', `host.innerHTML`);
    // assert.includes(host.innerHTML, 'nav-active', `host.innerHTML`); // TODO: fix this
    await tearDown();
  });

  it('generates nav with child links', async function () {
    this.timeout(5000);
    const { host, router, tearDown, scheduler } = await createFixture('qux');
    router.activeComponents =[router.createViewportInstruction('baz', 'main-viewport')];

    await scheduler.yieldAll();

    assert.includes(host.innerHTML, 'href="baz"', `host.innerHTML`);
    assert.includes(host.innerHTML, 'nav-has-children', `host.innerHTML`);
    assert.includes(host.innerHTML, 'nav-level-1', `host.innerHTML`);
    await tearDown();
  });
});

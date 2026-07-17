const copyStatusResets = new WeakMap<
  HTMLElement,
  { button: HTMLButtonElement; timer: number }
>();

function bindMenuControls(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-menu-toggle]")
    .forEach((toggle) => {
      if (toggle.dataset.bound === "true") return;

      const menuId = toggle.getAttribute("aria-controls");
      const menu = menuId ? document.getElementById(menuId) : null;
      if (!menu) return;

      const setExpanded = (expanded: boolean): void => {
        toggle.setAttribute("aria-expanded", String(expanded));
        menu.hidden = !expanded;
      };

      setExpanded(toggle.getAttribute("aria-expanded") === "true");
      toggle.dataset.bound = "true";
      toggle.addEventListener("click", () => {
        setExpanded(toggle.getAttribute("aria-expanded") !== "true");
      });

      if (menu.dataset.bound !== "true") {
        menu.dataset.bound = "true";
        menu.addEventListener("click", (event) => {
          if (event.target instanceof Element && event.target.closest("a")) {
            setExpanded(false);
          }
        });
      }
    });
}

function bindPlatformTabs(): void {
  document
    .querySelectorAll<HTMLElement>("[data-platform-tabs]")
    .forEach((root) => {
      if (root.dataset.bound === "true") return;

      const list = root.querySelector<HTMLElement>("[data-platform-list]");
      const tabs = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-platform-tab]"),
      );
      const panels = Array.from(
        root.querySelectorAll<HTMLElement>("[data-platform-panel]"),
      );
      if (!list || tabs.length === 0 || panels.length === 0) return;

      list.setAttribute("role", "tablist");

      const selectPlatform = (platform: string, focus = false): void => {
        tabs.forEach((tab) => {
          const selected = tab.dataset.platformTab === platform;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
          if (selected && focus) tab.focus();
        });

        panels.forEach((panel) => {
          panel.hidden = panel.dataset.platformPanel !== platform;
        });
      };

      tabs.forEach((tab, index) => {
        tab.setAttribute("role", "tab");
        tab.dataset.bound = "true";
        tab.addEventListener("click", () => {
          const platform = tab.dataset.platformTab;
          if (platform) selectPlatform(platform);
        });
        tab.addEventListener("keydown", (event) => {
          let nextIndex: number | undefined;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextIndex = (index + 1) % tabs.length;
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = tabs.length - 1;
          }

          if (nextIndex === undefined) return;
          event.preventDefault();
          const nextPlatform = tabs[nextIndex]?.dataset.platformTab;
          if (nextPlatform) selectPlatform(nextPlatform, true);
        });
      });

      panels.forEach((panel) => panel.setAttribute("role", "tabpanel"));
      const initialPlatform =
        root.dataset.defaultPlatform ?? tabs[0]?.dataset.platformTab;
      if (!initialPlatform) return;

      selectPlatform(initialPlatform);
      root.dataset.platformEnhanced = "true";
      root.dataset.bound = "true";
    });
}

function bindCopyButtons(): void {
  document
    .querySelectorAll<HTMLButtonElement>("button[data-copy]")
    .forEach((button) => {
      if (button.dataset.bound === "true") return;

      button.dataset.bound = "true";
      button.addEventListener("click", async () => {
        const text = button.dataset.copy;
        const statusId = button.dataset.status;
        const status = statusId ? document.getElementById(statusId) : null;
        if (!text || !status) return;

        button.disabled = true;
        let successful = false;
        try {
          const { copyText } = await import("../lib/clipboard");
          const clipboard = navigator.clipboard;
          if (clipboard) successful = await copyText(text, clipboard);
        } catch {
          successful = false;
        } finally {
          button.disabled = false;
        }

        const message = successful
          ? button.dataset.success
          : button.dataset.failure;
        if (!message) return;

        const previousReset = copyStatusResets.get(status);
        if (previousReset) {
          window.clearTimeout(previousReset.timer);
          delete previousReset.button.dataset.copyState;
        }

        button.dataset.copyState = successful ? "success" : "failure";
        status.textContent = message;
        const timer = window.setTimeout(() => {
          if (status.textContent === message) status.textContent = "";
          delete button.dataset.copyState;
          copyStatusResets.delete(status);
        }, 3_200);
        copyStatusResets.set(status, { button, timer });
      });
    });
}

function bindLocaleLinks(): void {
  document
    .querySelectorAll<HTMLAnchorElement>("[data-locale-link]")
    .forEach((link) => {
      if (link.dataset.bound === "true") return;

      link.dataset.bound = "true";
      if (link.dataset.localeBound === "true") return;

      link.addEventListener("click", () => {
        const target = new URL(link.href);
        target.hash = window.location.hash;
        link.href = target.href;

        const locale = link.dataset.locale;
        if (!locale) return;
        try {
          window.localStorage.setItem("memo-locale", locale);
        } catch {
          // The destination remains a normal link when storage is unavailable.
        }
      });
    });
}

function initializeInteractions(): void {
  bindMenuControls();
  bindPlatformTabs();
  bindCopyButtons();
  bindLocaleLinks();
}

initializeInteractions();

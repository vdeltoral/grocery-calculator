(function () {
  var state = { data: null, categoryIndex: 0, itemId: null, price: null, actuals: {} };
  var DEFAULT_CATEGORY_NAME = "Chicken Cuts (Protein)";

  var categoryHost = document.getElementById("category-select");
  var itemHost = document.getElementById("item-select");
  var priceInput = document.getElementById("price-input");
  var resultsBody = document.getElementById("results-body");
  var resultsCard = document.getElementById("results-card");

  fetch("conversions.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      state.data = data;
      var defaultIndex = data.categories.findIndex(function (c) { return c.name === DEFAULT_CATEGORY_NAME; });
      state.categoryIndex = defaultIndex >= 0 ? defaultIndex : 0;
      buildSelect(categoryHost, "category-label", data.categories.map(function (c, i) {
        return { value: String(i), label: c.name };
      }), String(state.categoryIndex), function (v) {
        state.categoryIndex = parseInt(v, 10);
        state.actuals = {};
        populateItems();
        render();
      });
      populateItems();
      render();
    })
    .catch(function (err) {
      ds.toast({ message: "Items not loaded · conversions.json unreadable", tone: "error" });
      console.error(err);
    });

  function buildSelect(host, labelId, options, selected, onChange) {
    var root = document.createElement("div");
    root.className = "select";
    root.dataset.value = selected;
    var current = options.find(function (o) { return o.value === selected; });

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "select-trigger";
    trigger.setAttribute("aria-labelledby", labelId);
    var value = document.createElement("span");
    value.className = "select-value";
    value.textContent = current.label;
    trigger.appendChild(value);
    trigger.insertAdjacentHTML("beforeend", '<svg class="ico ico-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>');

    var list = document.createElement("ul");
    list.className = "listbox";
    list.setAttribute("role", "listbox");
    list.hidden = true;
    options.forEach(function (o) {
      var li = document.createElement("li");
      li.className = "option";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(o.value === selected));
      li.dataset.value = o.value;
      li.textContent = o.label;
      list.appendChild(li);
    });

    root.appendChild(trigger);
    root.appendChild(list);
    host.replaceChildren(root);
    ds.init(host);
    root.addEventListener("ds:change", function (e) { onChange(e.detail); });
  }

  function currentCategory() {
    return state.data.categories[state.categoryIndex];
  }

  function populateItems() {
    var cat = currentCategory();
    state.itemId = cat.items[0].id;
    buildSelect(itemHost, "item-label", cat.items.map(function (it) {
      return { value: it.id, label: it.label };
    }), state.itemId, function (v) {
      state.itemId = v;
      render();
    });
  }

  priceInput.addEventListener("input", function () {
    var v = parseFloat(priceInput.value);
    state.price = isNaN(v) || v <= 0 ? null : v;
    render();
  });

  function chip(text, hue) {
    var el = document.createElement("span");
    el.className = "chip chip-" + hue;
    el.textContent = text;
    return el;
  }

  function render() {
    if (!state.data) return;
    var cat = currentCategory();
    var anchor = cat.items.find(function (it) { return it.id === state.itemId; });

    if (!anchor || state.price === null) {
      resultsCard.hidden = true;
      return;
    }

    resultsCard.hidden = false;
    resultsBody.replaceChildren();

    var valuePerDollarAnchor = anchor.value_per_lb / state.price;

    var rows = cat.items.map(function (item) {
      return { item: item, breakeven: item.value_per_lb / valuePerDollarAnchor, isAnchor: item.id === anchor.id };
    });
    rows.sort(function (a, b) { return b.item.value_per_lb - a.item.value_per_lb; });

    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      if (row.isAnchor) tr.className = "is-anchor";

      var tdItem = document.createElement("td");
      var cell = document.createElement("div");
      cell.className = "item-cell";
      var name = document.createElement("span");
      name.textContent = row.item.label;
      cell.appendChild(name);
      var status = document.createElement("span");
      cell.appendChild(status);
      if (row.isAnchor) status.appendChild(chip("Your price", "green"));
      tdItem.appendChild(cell);
      tr.appendChild(tdItem);

      var tdBreakeven = document.createElement("td");
      tdBreakeven.className = "num";
      tdBreakeven.textContent = "$" + row.breakeven.toFixed(2);
      tr.appendChild(tdBreakeven);

      var tdActual = document.createElement("td");
      tdActual.className = "num";
      if (row.isAnchor) {
        tdActual.textContent = "$" + state.price.toFixed(2);
      } else {
        var wrap = document.createElement("div");
        wrap.className = "price-wrap is-small";
        var prefix = document.createElement("span");
        prefix.className = "prefix";
        prefix.textContent = "$";
        var input = document.createElement("input");
        input.type = "text";
        input.inputMode = "decimal";
        input.autocomplete = "off";
        input.className = "input actual";
        input.setAttribute("aria-label", row.item.label + " price per lb");
        if (state.actuals[row.item.id] !== undefined) input.value = state.actuals[row.item.id];
        input.addEventListener("input", function () {
          var v = parseFloat(input.value);
          if (isNaN(v) || v <= 0) delete state.actuals[row.item.id];
          else state.actuals[row.item.id] = v;
          updateVerdict(status, row, input);
        });
        wrap.appendChild(prefix);
        wrap.appendChild(input);
        tdActual.appendChild(wrap);
        updateVerdict(status, row, input);
      }
      tr.appendChild(tdActual);

      resultsBody.appendChild(tr);
    });
  }

  function updateVerdict(status, row, input) {
    var v = parseFloat(input.value);
    status.replaceChildren();
    if (isNaN(v) || v <= 0) return;
    status.appendChild(v <= row.breakeven ? chip("Better deal", "green") : chip("Worse deal", "red"));
  }
})();

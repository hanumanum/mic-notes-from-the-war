$(document).ready(($) => {
  const ROOT_ELEMENT = $("#root");
  const BOOK = $("<div>").attr("id", "book").appendTo(ROOT_ELEMENT);
  (async () => {
    await getPage(1, BOOK);
    $(BOOK).css("opacity", "1");
    $(BOOK).turn({
      width: (window.innerWidth * 60) / 100,
      height: window.innerHeight - 55 - 120,
      page: 2,
    });
  })();

  async function getPage(pageNum, container) {
    const res = await fetch(
      `./pages/${$("html").attr("lang")}/p-${pageNum}.html`
    );
    if (res.status != 404) {
      const pageHtml = await res.text();
      $("<div>")
        .addClass("page")
        .css("background-image", `url('./inc/img/page ${pageNum}.png')`)
        .html(pageHtml)
        .appendTo(container);
      await getPage(++pageNum, BOOK);
    }
  }
});

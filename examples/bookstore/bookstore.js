tabris.load(function() {

  var books = [
    ["Schroder: A Novel", "Amity Gaige", "images/book_schroder.jpg"],
    ["Vampires in the Lemon Grove: Stories", "Karen Russell", "images/book_vampires.jpg", false, true],
    ["After Visiting Friends: A Son's Story", "Michael Hainey", "images/book_after_visiting.jpg", true, true],
    ["A History of Future Cities", "Daniel Brook", "images/book_a_history.jpg", true, true],
    ["Autobiography of Us: A Novel", "Aria Beth Sloss", "images/book_autobiografy.jpg", false, true],
    ["How Literature Saved My Life", "David Shields", "images/book_how_literature.jpg", true, false],
    ["The Dinner", "Herman Koch", "images/book_the_dinner.jpg", true, true]
  ].map(function(array) {
    return {
      title: array[0],
      author: array[1],
      image: [array[2], 106, 160],
      popular: array[3],
      favorite: array[4]
    };
  });

  var loremIpsum = "Etiam nisl nisi, egestas quis lacus ut, tristique suscipit metus. In " +
                   "vehicula lectus metus, at accumsan elit fringilla blandit. Integer et quam " +
                   "sed dolor pharetra molestie id eget dui. Donec ac libero eu lectus dapibus " +
                   "placerat eu a tellus. Fusce vulputate ac sem sit amet bibendum. Pellentesque " +
                   "euismod varius purus nec pharetra. Sed vitae ipsum sit amet risus vehicula " +
                   "euismod in at nunc. Sed in viverra arcu, id blandit risus. Praesent sagittis " +
                   "quis nisl id molestie. Donec dignissim, nisl id volutpat consectetur, massa " +
                   "diam aliquam lectus, sed euismod leo elit eu justo. Integer vel ante " +
                   "sapien.";

  var PAGE_MARGIN = 12;

  function createBooksPage(title, image, filter) {
    return tabris.create("Page", {
      title: title,
      topLevel: true,
      image: [image, 32, 32]
    }).append(createBooksList(books.filter(filter)));
  }

  function createBookPage(book) {
    var detailsComposite = createDetailsComposite(book)
      .set("layoutData", {top: 0, height: 184, left: 0, right: 0});
    var tabFolder = createTabFolder()
      .set("layoutData", {top: [detailsComposite, 0], left: 0, right: 0, bottom: 0});
    var separator = tabris.create("Label", {
      layoutData: {height: 1, right: 0, left: 0, top: [detailsComposite, 0]},
      background: "rgba(0, 0, 0, 0.1)"
    });
    return tabris.create("Page", {
      title: book.title
    }).append(detailsComposite, separator, tabFolder);
  }

  function createDetailsComposite(book) {
    var touchComp = tabris.create("Composite", {
      layoutData: {left: 0, right: 0, top: 0, height: 160 + 2 * PAGE_MARGIN}
    }).on("touchend", function() {
      createReadBookPage(book).open();
    });
    var imageLabel = tabris.create("Label", {
      layoutData: {height: 160, width: 106, left: PAGE_MARGIN, top: PAGE_MARGIN},
      image: book.image
    });
    var titleLabel = tabris.create("Label", {
      style: ["WRAP"],
      markupEnabled: true,
      text: "<b>" + book.title + "</b>",
      layoutData: {left: [imageLabel, PAGE_MARGIN], top: PAGE_MARGIN, right: PAGE_MARGIN}
    });
    var authorLabel = tabris.create("Label", {
      layoutData: {left: [imageLabel, PAGE_MARGIN], top: [titleLabel, PAGE_MARGIN]},
      text: book.author
    });
    var priceLabel = tabris.create("Label", {
      layoutData: {left: [imageLabel, PAGE_MARGIN], top: [authorLabel, PAGE_MARGIN]},
      foreground: "rgb(102, 153, 0)",
      text: "EUR 12,95"
    });
    return tabris.create("Composite", {
      background: "white",
      data: {showTouch: true}
    }).append(touchComp, imageLabel, titleLabel, authorLabel, priceLabel);
  }

  function createTabFolder() {
    var tabFolder = tabris.create("TabFolder", {
      style: ["TOP"],
      data: {paging: true}
    });
    var booksList = createBooksList(books);
    tabFolder.append(booksList);
    tabFolder.append("TabItem", {
      index: 0,
      text: "Related",
      control: booksList
    });
    var relatedComposite = tabris.create("Composite", {}).append("Label", {
      text: "Great Book.",
      layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN, right: PAGE_MARGIN, bottom: PAGE_MARGIN}
    });
    tabFolder.append(relatedComposite);
    tabFolder.append("TabItem", {
      index: 1,
      text: "Comments",
      control: relatedComposite
    });
    return tabFolder;
  }

  function createBooksList(books) {
    return tabris.create("List", {
      linesVisible: true,
      layoutData: {left: 0, right: 0, top: 0, bottom: 0},
      itemHeight: 72,
      template: [
        {
          type: "image",
          binding: "image",
          scaleMode: "FIT",
          left: [0, PAGE_MARGIN], top: [0, PAGE_MARGIN], width: 32, height: 48
        }, {
          type: "text",
          binding: "title",
          left: [0, 56], right: [0, PAGE_MARGIN], top: [0, PAGE_MARGIN], bottom: [0, 0],
          foreground: "rgb(74, 74, 74)"
        }, {
          type: "text",
          binding: "author",
          left: [0, 56], right: [0, PAGE_MARGIN], top: [0, 36], bottom: [0, 0],
          foreground: "rgb(123, 123, 123)"
        }
      ],
      items: books
    }).on("Selection", function(event) {
      createBookPage(event.item).open();
    });
  }

  function createReadBookPage(book) {
    var page = tabris.create("Page", {title: book.title});
    var composite = tabris.create("ScrollComposite", {
      parent: page,
      scroll: "vertical",
      layoutData: {left: 0, right: 0, top: 0, bottom: 0}
    });
    var titleLabel = tabris.create("Label", {
      parent: composite,
      style: ["WRAP"],
      markupEnabled: true,
      text: "<b>" + book.title + "</b>",
      layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN * 2, right: PAGE_MARGIN},
      foreground: "rgba(0, 0, 0, 0.5)"
    });
    tabris.create("Label", {
      parent: composite,
      style: ["WRAP"],
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: [titleLabel, PAGE_MARGIN], bottom: PAGE_MARGIN},
      text: [loremIpsum, loremIpsum, loremIpsum].join("\n\n")
    });
    return page;
  }

  function createSettingsPage() {
    return tabris.create("Page", {
      title: "Settings"
    }).append("Label", {
      text: "Settings",
      layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: PAGE_MARGIN, bottom: PAGE_MARGIN}
    });
  }

  var bookStorePage = createBooksPage("Book Store", "images/page_all_books.png", function() {
    return true;
  });

  createBooksPage("Popular", "images/page_popular_books.png", function(book) {
    return book.popular;
  });

  createBooksPage("Favorite", "images/page_favorite_books.png", function(book) {
    return book.favorite;
  });

  tabris.create("Action", {
    title: "Settings",
    placementPriority: "LOW",
    image: ["images/action_settings.png", 32, 32]
  }).on("Selection", function() {
    createSettingsPage().open();
  });

  bookStorePage.open();

});
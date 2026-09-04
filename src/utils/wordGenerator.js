import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  ImageRun,
  TableRow,
  TableCell,
  WidthType,
  Table,
} from "docx";




const normalParagraph = (text) =>
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,

    spacing: {
      line: 360,
      before: 0,
      after: 0,
    },

    children: [
      new TextRun({
        text,
        font: "Times New Roman",
        size: 24,
      }),
    ],
  });

const createFormattedParagraph = (line) => {
  const cleanLine = (line || "").trim();

  // ==========================================
  // DAY 1, DAY 2, DAY 3 ... DAY 7
  // ==========================================
  if (/^DAY\s+[1-7]\s*:?\s*$/i.test(cleanLine)) {
    return new Paragraph({
      alignment: AlignmentType.LEFT,

      spacing: {
        before: 240,
        after: 180,
      },

      children: [
        new TextRun({
          text: cleanLine.replace(/:$/, ""),
          bold: true,
          font: "Times New Roman",
          size: 28,
        }),
      ],
    });
  }

  // ==========================================
  // NUMBERED HEADINGS
  // ==========================================
  const numberedHeading =
    /^\d+\.\s.*:$/.test(cleanLine);

  if (numberedHeading) {
    return new Paragraph({
      spacing: {
        before: 240,
        after: 120,
      },

      children: [
        new TextRun({
          text: cleanLine,
          bold: true,
          font: "Times New Roman",
          size: 28,
        }),
      ],
    });
  }

  // ==========================================
  // BOLD MARKDOWN
  // ==========================================
  const match =
    cleanLine.match(/^(\d+\.\s)?\*\*(.*?)\*\*(.*)$/);

  if (!match) {
    return normalParagraph(
      cleanLine.replace(/\*\*/g, "")
    );
  }

  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,

    spacing: {
      line: 360,
      before: 0,
      after: 0,
    },

    children: [
      new TextRun({
        text: match[1] || "",
        font: "Times New Roman",
        size: 24,
      }),

      new TextRun({
        text: match[2],
        bold: true,
        font: "Times New Roman",
        size: 24,
      }),

      new TextRun({
        text: match[3],
        font: "Times New Roman",
        size: 24,
      }),
    ],
  });
};

// ======================================================
// IMAGE PLACEHOLDER
// ======================================================

const createImagePlaceholder = (imageBuffer) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },

    borders: {
      top: {
        style: "single",
        size: 8,
      },
      bottom: {
        style: "single",
        size: 8,
      },
      left: {
        style: "single",
        size: 8,
      },
      right: {
        style: "single",
        size: 8,
      },
    },

    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },

            verticalAlign: "center",

            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,

                spacing: {
                  before: 300,
                  after: 300,
                },

                children: [
                  new ImageRun({
                    data: imageBuffer,
                    transformation: {
                      width: 400,
                      height: 250,
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};


// ======================================================
// THREE IMAGE PLACEHOLDERS AFTER EACH DAY
// ======================================================

const createThreeImagePlaceholders = (imageBuffer) => {
  return [
    createImagePlaceholder(imageBuffer),

    new Paragraph({
      spacing: {
        before: 100,
        after: 100,
      },
    }),

    createImagePlaceholder(imageBuffer),

    new Paragraph({
      spacing: {
        before: 100,
        after: 100,
      },
    }),

    createImagePlaceholder(imageBuffer),

    new Paragraph({
      spacing: {
        before: 100,
        after: 300,
      },
    }),
  ];
};

export const generateWordDocument = async (
  activityTitle,
  report,
  department,
  academicYear
) => {
  try {
    const {
  objective,
  activityDetails,
  chapter3,
  reflectionNotes,
  conclusion,
} = report;



    const imageResponse = await fetch("/paste-image.png");
    const imageBuffer = await imageResponse.arrayBuffer();

    const chapterHeading = (text) =>
  new Paragraph({
    alignment: AlignmentType.LEFT,

    spacing: {
      before:0,
      after: 300,
    },

    children: [
      new TextRun({
        text,
        bold: true,
        font: "Times New Roman",
        size: 36,
      }),
    ],
  });

    const chapterTitle = (text) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 0,
          after: 200,
        },
        children: [
          new TextRun({
            text,
            bold: true,
            font: "Times New Roman",
            size: 36, // 18pt
          }),
        ],
      });

   const subHeading = (text) =>
  new Paragraph({
    alignment: AlignmentType.LEFT,

    spacing: {
      after: 300, // gap after 2.1 Title of the Activity
    },

    children: [
      new TextRun({
        text,
        bold: true,
        font: "Times New Roman",
        size: 32,
      }),
    ],
  });

    const activityName = (text) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
       spacing: {
  before: 0,
  after: 500, // larger gap after title
},
        children: [
          new TextRun({
            text,
            bold: true,
            italics: true,
            font: "Times New Roman",
            size: 32, // 16pt
          }),
        ],
      });
      const shortHeader =
  activityTitle.split(" ").slice(0, 4).join(" ");

  const deptMap = {
  CSE: "Dept. of CSE, SaIT",
  ECE: "Dept. of ECE, SaIT",
  ISE: "Dept. of ISE, SaIT",
  AIDS: "Dept. of AI&DS, SaIT",
  AIML: "Dept. of AI&ML, SaIT",
};

const deptText =
  deptMap[department?.toUpperCase()] ||
  department;

    const doc = new Document({
      sections: [
  {
    properties: {
  titlePage: true,
   pageNumberStart: 5,

  page: {
  margin: {
    top: 200,
    bottom: 726,
    left: 850,
    right: 561,
    header: 1000,
    footer: 360,
  },
},
},

headers: {
  first: new Header({
    children: [],
  }),

  default: new Header({
    children: [
      new Paragraph({
  alignment: AlignmentType.RIGHT,

  spacing: {
    after: 200,
  },

  children: [
    new TextRun({
      text: shortHeader,
      size: 22,
      font: "Times New Roman",
    }),
  ],
}),
    ],
  }),
},

footers: {
  first: new Footer({
    children: [],
  }),

  default: new Footer({
    children: [
      new Paragraph({
        tabStops: [
          {
            type: "center",
            position: 4500,
          },
          {
            type: "right",
            position: 9000,
          },
        ],

        children: [
          new TextRun({
            text: deptText,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
            text: academicYear,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
  children: [PageNumber.CURRENT],
  font: "Times New Roman",
  size: 22,
}),
        ],
      }),
    ],
  }),
},

    children: [
 new Paragraph({
  pageBreakBefore: true,
}),

new Paragraph({
  pageBreakBefore: true,
}),

new Paragraph({
  pageBreakBefore: true,
}),

new Paragraph({
  pageBreakBefore: true,
}),

new Paragraph({
  pageBreakBefore: true,
}),

chapterHeading("Chapter 2"),
  chapterTitle("OBJECTIVE"),
      subHeading("2.1 Title of the Activity"),
      activityName(activityTitle),

      ...objective
  .split("\n")
  .filter(line => line.trim() !== "")
  .map(line => createFormattedParagraph(line)),
    ],
  },

  {
   properties: {
  titlePage: false,

  page: {
  margin: {
    top: 200,
    bottom: 726,
    left: 850,
    right: 561,
    header: 720,
    footer: 360,
  },
},
},

headers: {
  first: new Header({
    children: [],
  }),

  default: new Header({
    children: [
      new Paragraph({
  alignment: AlignmentType.RIGHT,

  spacing: {
    after: 200,
  },

  children: [
    new TextRun({
      text: shortHeader,
      size: 22,
      font: "Times New Roman",
    }),
  ],
}),
    ],
  }),
},

footers: {
  first: new Footer({
    children: [],
  }),

  default: new Footer({
    children: [
      new Paragraph({
        tabStops: [
          {
            type: "center",
            position: 4500,
          },
          {
            type: "right",
            position: 9000,
          },
        ],

        children: [
          new TextRun({
            text: deptText,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
            text: academicYear,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
  children: [PageNumber.CURRENT],
  font: "Times New Roman",
  size: 22,
}),
        ],
      }),
    ],
  }),
},

    children: [
  chapterHeading("Chapter 3"),
  chapterTitle("ACTIVITY DETAILS"),
  subHeading("3.1 Timeline of Activity"),
new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({
      text: "Table 3.1:",
      font: "Times New Roman",
      size: 22,
    }),
  ],
}),



new Table({
  width: {
    size: 100,
    type: WidthType.PERCENTAGE,
  },

  rows: [
    new TableRow({
  children: [
    new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Sl.No",
              bold: true,
              size: 24, // 12pt
            }),
          ],
        }),
      ],
    }),

    new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Activity Done",
              bold: true,
              size: 24, // 12pt
            }),
          ],
        }),
      ],
    }),

    new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Hours",
              bold: true,
              size: 24, // 12pt
            }),
          ],
        }),
      ],
    }),
  ],
}),

    ...Array.from({ length: 10 }, (_, i) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
             new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({
      text: String(i + 1).padStart(2, "0"),
      size: 24,
    }),
  ],
})
             
            ],
          }),

          new TableCell({
  children: [
    new Paragraph({
     alignment: AlignmentType.CENTER,
      children: [
       new TextRun({
  text: "Type Your Activity",
  size: 24,
})
      ],
    }),
  ],
}),

          new TableCell({
            children: [
              new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({
      text: String(Math.floor(Math.random() * 5) + 8),
      size: 24,
    }),
  ],
})
            ],
          }),
        ],
            })
    ),

    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("")],
        }),

        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "TOTAL",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
          ],
        }),

        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "95 HOURS",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
}),





// ======================================================
// CHAPTER 3 - SEVEN DAY ACTIVITY
// ======================================================

...(() => {

  const text = chapter3 || "";

  const days = text.split(
    /(?=DAY\s+[1-7]\s*:?\s*$)/gim
  );

  const output = [];

  days.forEach((dayBlock) => {

    const trimmed = dayBlock.trim();

    if (!trimmed) return;

    const match = trimmed.match(
      /^(DAY\s+[1-7])\s*:?\s*\n?([\s\S]*)$/i
    );

    if (!match) return;

    const dayTitle = match[1].toUpperCase();
    const dayContent = match[2].trim();

    // ------------------------------------------
    // DAY HEADING
    // ------------------------------------------

    output.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,

        spacing: {
          before: 300,
          after: 200,
        },

        children: [
          new TextRun({
            text: dayTitle,
            bold: true,
            font: "Times New Roman",
            size: 30,
          }),
        ],
      })
    );

    // ------------------------------------------
    // DAY CONTENT
    // ------------------------------------------

    dayContent
      .split(/\n+/)
      .filter(line => line.trim() !== "")
      .forEach(line => {
        output.push(
          createFormattedParagraph(line)
        );
      });

    // ------------------------------------------
    // THREE IMAGE PLACEHOLDERS
    // ------------------------------------------

    output.push(
      ...createThreeImagePlaceholders(imageBuffer)
    );

  });

  return output;

})(),      
    ],
    
  },

  {
    properties: {
  titlePage: true,

  page: {
  margin: {
    top: 200,
    bottom: 726,
    left: 850,
    right: 561,
    header: 1000,
    footer: 360,
  },
},
},

headers: {
  first: new Header({
    children: [],
  }),

  default: new Header({
    children: [
      new Paragraph({
  alignment: AlignmentType.RIGHT,

  spacing: {
    after: 200,
  },

  children: [
    new TextRun({
      text: shortHeader,
      size: 22,
      font: "Times New Roman",
    }),
  ],
}),
    ],
  }),
},

footers: {
  first: new Footer({
    children: [],
  }),

  default: new Footer({
    children: [
      new Paragraph({
        tabStops: [
          {
            type: "center",
            position: 4500,
          },
          {
            type: "right",
            position: 9000,
          },
        ],

        children: [
          new TextRun({
            text: deptText,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
            text: academicYear,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
  children: [PageNumber.CURRENT],
  font: "Times New Roman",
  size: 22,
}),
        ],
      }),
    ],
  }),
},

    children: [
      chapterHeading("Chapter 4"),
      chapterTitle("REFLECTION NOTES"),

      ...reflectionNotes
  .split("\n")
  .filter(line => line.trim() !== "")
  .map(line => createFormattedParagraph(line)),
    ],
  },

  {
    properties: {
  titlePage: true,

  page: {
  margin: {
    top: 200,
    bottom: 726,
    left: 850,
    right: 561,
    header: 1000,
    footer: 360,
  },
},
},

headers: {
  first: new Header({
    children: [],
  }),

  default: new Header({
    children: [
      new Paragraph({
  alignment: AlignmentType.RIGHT,

  spacing: {
    after: 200,
  },

  children: [
    new TextRun({
      text: shortHeader,
      size: 22,
      font: "Times New Roman",
    }),
  ],
}),
    ],
  }),
},

footers: {
  first: new Footer({
    children: [],
  }),

  default: new Footer({
    children: [
      new Paragraph({
        tabStops: [
          {
            type: "center",
            position: 4500,
          },
          {
            type: "right",
            position: 9000,
          },
        ],

        children: [
          new TextRun({
            text: deptText,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

          new TextRun({
            text: academicYear,
            font: "Times New Roman",
            size: 22, // 11pt
          }),

          new TextRun("\t"),

         new TextRun({
  children: [PageNumber.CURRENT],
  font: "Times New Roman",
  size: 22,
}),
        ],
      }),
    ],
  }),
},

    children: [
      chapterHeading("Chapter 5"),
      chapterTitle("CONCLUSION"),

      ...conclusion
  .split("\n")
  .filter(line => line.trim() !== "")
  .map(line => createFormattedParagraph(line)),
    ],
  },
],
    });

    const blob = await Packer.toBlob(doc);
    
    
    
    console.log("COMMON REPORT GENERATED");

    return blob;
  } catch (error) {
    console.error(error);
    alert("Word generation failed");
  }
};
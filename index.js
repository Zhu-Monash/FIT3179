var config = {
  title: {
    text: "Expenditure  by State",
    align: "left",
    anchor: "start",
    color: "#233142",
    fontSize: 25,
  },
  width: window.innerWidth * 0.3,
  height: window.innerHeight * 0.4,
  projection: { type: "equirectangular" },
  data: {
    url: "aus.json",
    format: { type: "topojson", feature: "states" },
  },
  transform: [
    {
      lookup: "properties.STATE_NAME",
      from: {
        data: { url: "exp_by_state.csv" },
        key: "code",
        fields: ["real_expenditure_millions"],
      },
      default: 0,
    },
  ],

  encoding: {
    color: {
      field: "properties.STATE_NAME",
      type: "nominal",
      scale: {
        type: "nominal",
        scheme: "category20",
      },
    },
    tooltip: [
      {
        field: "real_expenditure_millions",
        type: "quantitative",
        format: ".2%",
        title: "expenditure(millions)%",
      },
      {
        field: "properties.STATE_NAME",
        type: "norminal",
        title: "State",
      },
    ],
  },
  layer: [
    {
      mark: { type: "geoshape" },
    },
    {
      mark: { type: "text", align: "left", baseline: "middle", dx: 3 },
      encoding: {
        // text: {
        //   field: "real_expenditure_millions",
        //   type: "quantitative",
        //   format: ".2%",
        // },
      },
    },
  ],
};

vegaEmbed("#vis", config);

//line
const line = {
  title: {
    text: "Australia's annual total health expenditure trends",
    align: "left",
    anchor: "start",
    color: "#233142",
    fontSize: 25,
  },

  data: { url: "health.csv" },
  vconcat: [
    {
      width: window.innerWidth * 0.4,
      height: window.innerHeight * 0.3,
      mark: { type: "line", point: true },
      selection: {
        brush: {
          type: "interval",
          encodings: ["x"],
        },
      },
      encoding: {
        x: { field: "financial_year", axis: { labelAngle: 360 } },
        y: { aggregate: "sum", field: "real_expenditure_millions" },
        color: {
          field: "state",
          scale: {
            type: "nominal",
            scheme: "category20",
          },
        },
        tooltip: [
          { field: "state", title: "State" },
          { field: "financial_year", title: "Financial Year" },
          {
            aggregate: "sum",
            field: "real_expenditure_millions",
            title: "Real Expenditure Millions",
          },
        ],
      },
    },
    //bar
    {
      width: window.innerWidth * 0.4,
      height: window.innerHeight * 0.3,
      transform: [
        {
          filter: { selection: "brush" },
        },
      ],

      encoding: {
        x: {
          field: "area_of_expenditure",
          type: "nominal",
          sort: { encoding: "y", order: "descending" },
        },
        y: { aggregate: "sum", field: "real_expenditure_millions" },
      },
      layer: [
        {
          mark: "bar",
          selection: {
            broad: {
              type: "interval",
            },
          },
          encoding: {
            fill: {
              field: "area_of_expenditure",
              scale: {
                type: "nominal",
                scheme: "category20",
              },
            },
            tooltip: [
              {
                field: "area_of_expenditure",
              },
              {
                aggregate: "sum",
                field: "real_expenditure_millions",
                title: "Real Expenditure Millions",
              },
            ],
          },
        },
        {
          mark: { type: "text", baseline: "bottom" },
          encoding: {
            text: {
              aggregate: "sum",
              field: "real_expenditure_millions",
            },
          },
        },
      ],
    },
    //broad
    {
      width: window.innerWidth * 0.4,
      height: window.innerHeight * 0.3,
      transform: [
        {
          filter: { selection: "broad" },
        },
      ],
      mark: { type: "bar" },
      encoding: {
        y: {
          field: "broad_source_of_funding",
          sort: {
            encoding: "",
            order: "",
          },
        },
        x: { aggregate: "sum", field: "real_expenditure_millions" },
        color: { field: "detailed_source_of_funding" },
        tooltip: [
          {
            field: "broad_source_of_funding",
          },
          {
            field: "detailed_source_of_funding",
          },
          {
            aggregate: "sum",
            field: "real_expenditure_millions",
            title: "Real Expenditure Millions",
          },
        ],
      },
    },
  ],
};
vegaEmbed("#line", line);

var adaptationRules = [
    {
        "name":"nightMode",
        "enabled":true,
        "active":false,
        "condition":
            {
                "operator":">",
                "operant1":"time",
                "operant2":"20"
            },
        "action":"nightMode"
    },
    {
        "name":"highAmbientLight",
        "enabled":true,
        "active":false,
        "condition":
            {
                "operator":">",
                "operant1":"light",
                "operant2":"50"
            },
        "action":"highAmbientLight"
    },
    {
        "name":"lowAmbientLight",
        "enabled":true,
        "active":false,
        "condition":
            {
                "operator":"<",
                "operant1":"light",
                "operant2":"50"
            },
        "action":"lowAmbientLight"
    },
    {
        "name":"greaterFontSize",
        "enabled":true,
        "active":false,
        "condition":
            {
                "operator":"<",
                "operant1":"light",
                "operant2":"50"
            },
        "action":"greaterFontSize"
    },
    {
        "name":"custom",
        "enabled":true,
        "active":false,
        "condition":
            {
                "operator":"<",
                "operant1":"light",
                "operant2":"50"
            },
        "action":"customOperation"
    },
    {
        "name":"blackWhiteMode",
        "enabled":true,
        "active":false,
        "condition":
            {
                "operator":"<",
                "operant1":"light",
                "operant2":"50"
            },
        "action":"blackWhiteMode"
    }
  ];
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
const REGIONS = {
  Грузия: {
    lable: "🇬🇪",
    cooldown: {
      day: 365,
      escResetCoolDown: true,
    },
    arrival: {
      isCar: null,
      day: null,
      mount: null,
      year: null,
      entered: "Турция",
    },
    departure: {
      isCar: null,
      day: null,
      mount: null,
      year: null,
      entered: "Турция",
    },
    howLongDay: null,
    maximumStay: 365,
    car: {
      isCar: true,
      escResetCoolDown: true,
      cooldown: {
        day: 90,
      },
      arrival: {
        day: null,
        mount: null,
        year: null,
        entered: "Турция",
      },
      departure: {
        day: null,
        mount: null,
        year: null,
        entered: "Турция",
      },
      howLongDay: null,
      maximumStay: 90,
    },
  },
  Турция: {
    lable: "🇹🇷",
    cooldown: {
      day: 180,
      escResetCoolDown: false,
    },
    arrival: {
      isCar: null,
      day: null,
      mount: null,
      year: null,
      entered: "Грузия",
    },
    departure: {
      isCar: null,
      day: null,
      mount: null,
      year: null,
      entered: "Грузия",
    },
    howLongDay: null,
    maximumStay: 90,
    car: {
      isCar: true,
      cooldown: {
        day: 90,
      },
      arrival: {
        day: null,
        mount: null,
        year: null,
        entered: "Грузия",
      },
      departure: {
        day: null,
        mount: null,
        year: null,
        entered: "Грузия",
      },
      howLongDay: null,
      maximumStay: 90,
    },
  },
};
let mapList = new Map();
function getCoordinatFile() {
  let fm = FileManager.iCloud();
  let file = fm.joinPath(fm.documentsDirectory(), "vizRun.txt");
  let str = fm.readString(file);
  let arr = "[" + str.slice(0, -1) + "]";
  let res = JSON.parse(arr);
  return res;
}

let coordinats = getCoordinatFile();
let toDayRegino = coordinats[coordinats.length - 1];

function RegionList(array) {
  array.forEach((item) => {
    mapList.set(item.region);
  });
  const keys = Array.from(mapList.keys());
}

function vizRun(location) {
  //сегодня
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  //прошлый год
  const lastYear = today.getFullYear() - 1;
  const lastYearDate = new Date(lastYear, today.getMonth(), day);

  //парсим историю
  let regionNow = {};
  let regionLast = {};
  let result = location.reduce(
    (history, item) => {
      if (item.region === "") {
        return history;
      } else {
        if (item.region)
          if (!regionNow[item.region]) {
            regionNow[item.region] = { dayList: [] };
          }
        let vizRunDate = new Date();
        vizRunDate.setDate(today.getDate() - REGIONS[item.region].cooldown.day);
        let itemDate = new Date(`${item.year}-${item.m}-${item.day}`);
        if (vizRunDate > itemDate) {
        } else {
          if (!history.region) {
            history.region = item.region;
          }

          if (
            !history.hisotyDayList.includes(
              `${item.year}-${item.month}-${item.day}`
            )
          ) {
            console.log("TRUE" + history.hisotyDayList);
            history.hisotyDayList.push(
              `${item.year}-${item.month}-${item.day}`
            );
            regionNow[item.region].dayList.push(
              `${item.year}-${item.month}-${item.day}`
            );
            if (history.region !== item.region) {
              if (REGIONS[history.region].cooldown.escResetCoolDown) {
                console.log("RESET COOLDOWN 1");
                regionNow[history.region].dayList = [];
              }
              history.region = item.region;
            } else {
              history.region = item.region;
            }
          } else {
            //если этот день есть
            console.log("FALSE" + history.hisotyDayList);

            let keys = Object.keys(regionNow);
            for (let element of keys) {
              console.log(item.region + "1111");
              console.log(regionNow[element].dayList.length);

              if (element !== item.region) {
                //день региона не соответствует текущему
                if (REGIONS[element].cooldown.escResetCoolDown) {
                  //регион колдаун
                  regionNow[element].dayList = [];
                } else {
                  //регион не колдаун
                }
                if (
                  !regionNow[element].dayList.includes(
                    `${item.year}-${item.month}-${item.day}`
                  )
                ) {
                  //регион не содержит данный день
                  regionNow[element].dayList.push(
                    `${item.year}-${item.month}-${item.day}`
                  );
                  console.log(element + "2222");
                  console.log(regionNow[element].dayList.length);
                } else {
                  //регион содержит данный день
                }
              } else {
                //день региона соответствует текущему
                //ПРОВЕРИТЬ
                if (REGIONS[element].cooldown.escResetCoolDown) {
                  regionNow[element].dayList = [];
                  regionNow[element].dayList.push(
                    `${item.year}-${item.month}-${item.day}`
                  );
                } else {
                  if (
                    !regionNow[element].dayList.includes(
                      `${item.year}-${item.month}-${item.day}`
                    )
                  ) {
                    regionNow[element].dayList.push(
                      `${item.year}-${item.month}-${item.day}`
                    );
                  }
                }
              }
            }
          }
          history.region = item.region;
        }
        return history;
      }
    },
    { region: null, hisotyDayList: [] }
  );
  console.log("Грузия " + regionNow["Грузия"].dayList);
  console.log("Турция " + regionNow["Турция"].dayList);
  return regionNow;
}

function comparisonDate(Pdate1, Pdate2) {
  const date1 = new Date(Pdate1);
  const date2 = new Date(Pdate2);
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();
  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();
  const diffInDays = Math.floor(
    (Date.UTC(year2, month2, day2) - Date.UTC(year1, month1, day1)) /
      (1000 * 60 * 60 * 24)
  );
  return diffInDays;
}

let testDate = comparisonDate("2023-03-20", "2023-04-10");
RegionList(coordinats);

//++++++++++++рисовалка++++++++++++
const width = 25;
const h = 5;
const widget = new ListWidget(coordinats);
widget.backgroundColor = new Color("#222222");
let regionsNow = vizRun(coordinats);

let keys = Object.keys(regionsNow);

for (let element of keys) {
  newTextWidget(
    element,
    regionsNow[element].dayList.length,
    REGIONS[element].lable
  );
}

function newTextWidget(region, day, lable) {
  const stack = widget.addStack();
  const titlew1 = stack.addText(region);
  titlew1.textColor = new Color("#ffffff"); //e587ce
  titlew1.font = Font.boldSystemFont(13);
  const titlew2 = stack.addText("" + lable);
  titlew2.textColor = new Color("#ffffff"); //e587ce
  titlew2.font = Font.boldSystemFont(13);
  widget.addSpacer(6);

  const titlew3 = widget.addText("" + day);
  titlew3.textColor = new Color("#ffffff"); //e587ce
  titlew3.font = Font.boldSystemFont(13);
  widget.addSpacer(6);
}
Script.setWidget(widget);
Script.complete();
widget.presentMedium();

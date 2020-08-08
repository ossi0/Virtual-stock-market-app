// NÄYTTÄÄ MAHDOLLISET PARAMETRIT
// http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=DescribeStoredQueries&storedquery_id=fmi::observations::weather::daily::timevaluepair&

// SÄÄTIEDOTUS
// http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::daily::timevaluepair&

// NÄYTTÄÄ MAHDOLLISET requestParameter VAIHTOEHDOT KUN HAETAAN SÄÄHAVAINTOJA (fmi::observations::weather::daily::multipointcoverage)
// http://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi%3A%3Aobservations%3A%3Aweather%3A%3Adaily%3A%3Asimple&param=td&starttime=2013-05-10T08%3A00%3A00Z&endtime=2013-05-12T10%3A00%3A00Z&timestep=60&fmisid=101799

// NÄYTTÄÄ KAIKKI STORED_QUERY_OBSERVATION - vaihtoehdot
// https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=describeStoredQueries

var parser = new Metolib.WfsRequestParser();
var SERVER_URL = "http://opendata.fmi.fi/wfs";
var STORED_QUERY_OBSERVATION =
  "fmi::observations::weather::daily::multipointcoverage";
parser.getData({
  url: SERVER_URL,
  storedQueryId: STORED_QUERY_OBSERVATION,
  requestParameter: "tmin,tmax",
  begin: new Date("2018-07-10T13:00:00Z").getTime(),
  end: new Date("2018-08-10T13:00:00Z").getTime(),
  fmisid: 101799,
  callback: function (data, errors) {
    console.log(data);
  },
});

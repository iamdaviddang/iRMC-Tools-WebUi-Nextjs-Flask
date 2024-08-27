const DateTime = () => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();
  let day_number = d.getDate();
  let day_week = d.getDay();
  let month_number = d.getMonth();
  console.log(d);
  return (
    <div>
      <p className="font-bold cursor-default text-primary drop-shadow">
        {weekday[day_week]} {day_number} {month[month_number]}
      </p>
    </div>
  );
};

export default DateTime;

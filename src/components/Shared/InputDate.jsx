/* eslint-disable react/prop-types */
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import useStore from "../../zustand/useStore";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const InputDate = ({ startDate, setStartDate, ref }) => {
  const { mode } = useStore();
  return (
    <DatePicker
      ref={ref}
      className={`w-32 lg:w-52 px-3 py-2 text-xs lg:text-sm rounded-sm  outline-none border-2 border-slate-600 focus:border-teal-500 ${
        mode === "light"
          ? "text-black bg-transparent"
          : "text-white bg-[#201F1F]"
      }`}
      placeholderText="mm-dd-yyyy"
      selected={startDate}
      onChange={(date) => setStartDate(date)}
    />
  );
};
export default InputDate;

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
      showIcon
      ref={ref}
      className={`w-full px-3 py-2 text-xs lg:text-sm rounded-sm text-center  outline-none border-2 border-slate-600 xl:border-0 focus:border-teal-500 bg-blue-400 ${
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

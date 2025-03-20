import React from "react"

const defaultClassName = "appearance-none bg-gray-50 checked:bg-[#FF570C] self-center w-100% h-6 w-6 reletive rounded-sm cursor-pointer"

interface CCheckBoxInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    InputClassName?: string; // Make className optional
    addClassName?: string;
    label: string;
    addSpanclassName?: string;
}

const CCheckBox: React.FC<CCheckBoxInterface> = ({ InputClassName = defaultClassName, addSpanclassName: SpanclassName, addClassName: AddClassName, label: Label, ...props }) => {
    return <span className={`justify-items-center inline-flex ${SpanclassName}`}>
        <input type="checkbox"
            className={AddClassName === undefined ? InputClassName : `${InputClassName} ${AddClassName}`}
            {...props}
        />
        <span className="ml-2 text-[18px] self-center top-0 inline">{Label}</span>
    </span>
}

export default CCheckBox
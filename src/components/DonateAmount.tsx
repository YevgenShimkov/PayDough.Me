import {Dispatch, FC, SetStateAction, useState} from "react";
import {FormFieldsObj} from "@/pages/inline";

interface DonateAmountProps {
  formField: FormFieldsObj,
  setFormFields: Dispatch<SetStateAction<FormFieldsObj>>
}


const donateFormatNumber = (num: string) => {
  let numStr = num;
  let result = '';

  if (numStr[0] === '-') {
    result = '-';
    numStr = numStr.slice(1);
  }

  let decimalPart = '';
  const decimalIndex = numStr.indexOf('.');
  if (decimalIndex !== -1) {
    decimalPart = numStr.slice(decimalIndex);
    numStr = numStr.slice(0, decimalIndex);
  }

  for (let i = numStr.length - 1; i >= 0; i--) {
    const digit = numStr[i];
    if ((numStr.length - i) % 3 === 0 && i !== 0) {
      result = ' ' + digit + result;
    } else {
      result = digit + result;
    }
  }
  result += decimalPart;
  return result;
}


const DonateAmount: FC<DonateAmountProps> = ({formField, setFormFields}) => {
  const donateVariants = ["1", "3", "5", "10", "120"]
  // const [selectedDonate, setSelectedDonate] = useState<string>("")
  const [isOtherAmount, setIsOtherAmount] = useState<boolean>(false)


  // const amountHandler = (selectedAmount: number) => {
  //   setFormFields(({...formField, amount: selectedDonate}))
  // }

  const layoutDonatsVariant = () => {
    return (
      <>
        {donateVariants.map((itm) => {
          return (
            <div key={itm}
                 className={`flex justify-center border border-blue-500 cursor-pointer p-1.5 rounded-md hover:bg-blue-500 min-w-[85px] ${formField.amount === itm ? "bg-blue-500" : ""}`}
                 onClick={() => {
                   isOtherAmount && setIsOtherAmount(false)
                   setFormFields(({...formField, amount: itm}))
                 }}>$ {itm}</div>)
        })
        }
        <div
          className={`flex justify-center border border-blue-500 cursor-pointer p-1.5 rounded-md hover:bg-blue-500 min-w-[85px] ${isOtherAmount ? "bg-blue-500" : ""}`}
          onClick={() => {
            setFormFields(({...formField, amount: ''}))
            !isOtherAmount && setIsOtherAmount(true)
          }}>Other amount...</div>
        {isOtherAmount && <div>
          <label htmlFor="other-amount">enter the amount </label>
          <input
            type="number"
            name="other-amount"
            placeholder="$0.00"
            onChange={event =>  setFormFields(({...formField, amount: donateFormatNumber(event.target.value)}))}
            value={formField.amount}
          />
        </div>}
      </>)
  }

  return (
    <>
      <h2>Select an amount</h2>
      <div className="flex gap-3 flex-wrap w-80 justify-between my-7">
        {layoutDonatsVariant()}
      </div>
      <div className='m-4'>selected donate: $ {formField.amount} </div>
    </>

  )
};

export default DonateAmount;

import {useEffect, useState} from "react";
import Script from "next/script";
import DonateAmount from "@/components/DonateAmount";
import querystring from "querystring";
import {allowedDisplayValues} from "next/dist/compiled/@next/font/dist/constants";

export interface FormFieldsObj {
  firstName: string,
  lastName: string,
  amount: string,
  isSubmitting: boolean,
  alertMessage: string,
}

const Inline = () => {
  const [dataReq, setDataReq] = useState<{ icon: string, path: string, id: number }[]>([])
  const [formFields, setFormFields] = useState<FormFieldsObj>({
    firstName: "",
    lastName: "",
    amount: "",
    isSubmitting: false,
    alertMessage: "",
  })

  const finishSubmit = (response: any) => {
    setFormFields((prevState) => {
      const formData = {
        firstName: prevState.firstName,
        lastName: prevState.lastName,
        amount: prevState.amount,
        token: response.token
      };
      console.log(formData);
      return {
        ...prevState,
        isSubmitting: false,
        alertMessage: "The form was submitted. Check the console to see the output data!!."
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getElements();
    // setFormFields((prevState) => ({...prevState, isSubmitting: true}));
    // window.CollectJS.startPaymentRequest();
    // doSale(
    //   '  5mN8N7-jhr55W-N22pxX-uAW2s9',
    //   '108.00', // amount
    //   '4111111111111111', // ccNum
    //   '1225', // ccExp
    //   '123', // cvv
    //   { first_name: 'John', last_name: 'Doe', address1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'US', phone: '123-456-7890', email: 'john.doe@example.com' }, // billingInformation
    //   { shipping_first_name: 'Jane', shipping_last_name: 'Doe', shipping_address1: '456 Elm St', shipping_city: 'Othertown', shipping_state: 'CA', shipping_zip: '54321', shipping_country: 'US', shipping_email: 'jane.doe@example.com' } // shippingInformation
    // );
  }


  useEffect(() => {
    window.CollectJS && window.CollectJS.configure({
      variant: "inline",
      styleSniffer: true,
      callback: (token: string) => {
        console.log(token);
        finishSubmit(token)
      },
      fields: {
        ccnumber: {
          placeholder: "CC Number",
          selector: "#ccnumber"
        },
        ccexp: {
          placeholder: "CC Expiration",
          selector: "#ccexp"
        },
        cvv: {
          placeholder: "CVV",
          selector: "#cvv"
        }
      }
    });
  }, [])

  const getElements = async () => {
    const response = await fetch("http://localhost:3000/api/testReq/");
    const data = await response.json();
    setDataReq(data)
  }


  return (
    <>
      <div className="flex justify-center flex-col items-center mt-10">
        {formFields.alertMessage && (
          <div className="alert">
            {formFields.alertMessage}
          </div>
        )}
        <div className="h-auto w-full bg-blue-500 text-amber-50">
          {dataReq && dataReq.map((itm: { icon: string, path: string, id: number }) => (
            <div key={itm.id}>{itm.icon}</div>
          ))}</div>
        <div className="font-medium text-base text-slate-900">PayDough.me Ltd</div>
        <DonateAmount formField={formFields} setFormFields={setFormFields}/>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center flex-col gap-3">
            <div>
              <input
                className="text-base border border-gray-800 rounded-md px-3 py-2 w-full"
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={event => setFormFields({...formFields, firstName: event.target.value})}
                value={formFields.firstName}
              />
            </div>
            <div>
              <input
                className="text-base border border-gray-800 rounded-md px-3 py-2 w-full"
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={event => setFormFields({...formFields, lastName: event.target.value})}
                value={formFields.lastName}
              />
            </div>
            <div id="ccnumber" className="text-base border border-gray-800 rounded-md px-3 py-2 w-full"/>
            <div id="ccexp" className="text-base border border-gray-800 rounded-md px-3 py-2 w-full"/>
            <div id="cvv" className="text-base border border-gray-800 rounded-md px-3 py-2 w-full"/>
          </div>
          <button
            type="submit"
            disabled={formFields.isSubmitting}
            className={`w-full bg-teal-600 rounded-md px-3 py-2 mt-10 ${formFields.isSubmitting && "opacity-75"}`}
          >
            Submit {formFields.amount && <span>: $</span>}{`${formFields.amount && formFields.amount}`}
          </button>
        </form>
      </div>
      <Script
        src="https://secure.safewebservices.com/token/Collect.js"
        data-tokenization-key="5mN8N7-jhr55W-N22pxX-uAW2s9"
        strategy="beforeInteractive"
      ></Script>
    </>
  );
};

export default Inline;

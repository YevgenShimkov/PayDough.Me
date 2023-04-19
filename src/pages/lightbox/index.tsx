import {FormEvent, FormEventHandler, useEffect, useState} from "react";
import Link from "next/link";
import Script from "next/script";

interface StateObj {
  firstName: string,
  lastName: string,
  amount: string,
  isSubmitting: boolean,
  alertMessage: string,
}

const Lightbox = ({}) => {

  const [state, setState] = useState<StateObj>({
    firstName: "",
    lastName: "",
    amount: "",
    isSubmitting: false,
    alertMessage: "",
  })

  useEffect(() => {
    window.CollectJS && window.CollectJS.configure({
      variant: "lightbox",
      callback: (token: string) => {
        console.log(token);
        finishSubmit(token);
      }
    });
    console.log(window.CollectJS)
  }, [])


  const finishSubmit = (response) => {
    console.log(response)
    const {isSubmitting, alertMessage, ...formData} = {...state};
    formData.token = response.token;
    console.log(formData);
    setState((prevState) => ({
      ...prevState,
      isSubmitting: true,
      alertMessage: "The form was submitted. Check the console to see the output data."
    }));
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState((prevState) => ({...prevState, isSubmitting: true}));
    console.log(window.CollectJS)
    window.CollectJS.startPaymentRequest();
  }

  return (
    <>
      <div className="App">
        <div>
          <h1>Lightbox Cart Page</h1>
          <Link href="/Inline">Inline Cart Page</Link>
          <br/>
          <Link href="/">Home page</Link>
        </div>
        <br/>
        {state.alertMessage && (
          <div className="alert">
            {state.alertMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={event => setState((prevState) => ({...prevState, firstName: event.target.value}))}
              value={state.firstName}
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={event => setState((prevState) => ({...prevState, lastName: event.target.value}))}
              value={state.lastName}
            />
          </div>
          <div>
            <input
              type="text"
              name="amount"
              placeholder="Amount"
              onChange={event => setState((prevState) => ({...prevState, amount: event.target.value}))}
              value={state.amount}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={state.isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Script
        src="https://secure.safewebservices.com/token/Collect.js"
        data-tokenization-key="5mN8N7-jhr55W-N22pxX-uAW2s9"
        strategy="afterInteractive"
      ></Script>
    </>
  )
};

export default Lightbox;

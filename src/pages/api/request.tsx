import querystring from 'querystring';
import https from 'https';

function DirectPost(security_key) {
  let billing = {};
  let shipping = {};

  function setBilling(billingInformation) {
    // Validate that passed in information contains valid keys
    const validBillingKeys = [
      'first_name',
      'last_name',
      'company',
      'address1',
      'address2',
      'city',
      'state',
      'zip',
      'country',
      'phone',
      'fax',
      'email',
    ];

    for (let key in billingInformation) {
      if (!validBillingKeys.includes(key)) {
        throw new Error(
          `Invalid key provided in billingInformation. '${key}' is not a valid billing parameter.`
        );
      }
    }

    billing = billingInformation;
  }

  function setShipping(shippingInformation) {
    // Validate that passed in information contains valid keys
    const validShippingKeys = [
      'shipping_first_name',
      'shipping_last_name',
      'shipping_company',
      'shipping_address1',
      'address2',
      'shipping_city',
      'shipping_state',
      'shipping_zip',
      'shipping_country',
      'shipping_email',
    ];

    for (let key in shippingInformation) {
      if (!validShippingKeys.includes(key)) {
        throw new Error(
          `Invalid key provided in shippingInformation. '${key}' is not a valid shipping parameter.`
        );
      }
    }

    shipping = shippingInformation;
  }

  function doSale(amount, ccNum, ccExp, cvv) {
    let requestOptions = {
      type: 'sale',
      amount: amount,
      ccnumber: ccNum,
      ccexp: ccExp,
      cvv: cvv,
    };

    // Merge together all request options into one object
    Object.assign(requestOptions, billing, shipping);

    // Make request
    _doRequest(requestOptions);
  }

  function _doRequest(postData) {
    const hostName = 'paydoughme.transactiongateway.com';
    const path = '/api/transact.php';

    postData.security_key = security_key;
    postData = querystring.stringify(postData);

    const options = {
      hostname: hostName,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    // Make request to Payment API
    const req = https.request(options, (response) => {
      console.log(`STATUS: ${response.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

      response.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      response.on('end', () => {
        console.log('No more data in response.');
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    // Write post data to request body
    req.write(postData);
    req.end();
  }

  return {
    setBilling,
    setShipping,
    doSale,
  };
}

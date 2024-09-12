export async function starPaymentFetch(apiKey, _title, _description, _prices) {
  const fetchResult = {
    success: false,
    data: null,
    error: false,
  };

  const request = {
    title: _title,
    description: _description,
    payload: 'product_payload',
    currency: 'XTR',
    prices: _prices,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  };

  try {
    const url = `https://api.telegram.org/bot${apiKey}/createInvoiceLink`;
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.ok) {
      fetchResult.success = true;
      fetchResult.data = data.result;
    } else {
      fetchResult.success = false;
      fetchResult.error = data;
    }
  } catch (err) {
    fetchResult.success = false;
    fetchResult.error = true;
    fetchResult.data = err;
  }

  return fetchResult;
}

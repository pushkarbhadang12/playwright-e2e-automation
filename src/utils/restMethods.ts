import { request, APIResponse } from "@playwright/test";
import Log from '../config/logger';

export default class RESTMethods {

	/**
	 * Sends a GET request to the specified URL and returns the Playwright APIResponse.
	 * @param url - The full URL or path to send the GET request to
     * @param description - A brief description of the request for logging purposes
     * @param headers - Optional HTTP headers to include with the request
	 * @returns {Promise<APIResponse>} The Playwright APIResponse object
	 */
	public async sendGETRequest(url: string, description: string, Headers?: any): Promise<APIResponse> {
		let apiContext: any;
		try {
			apiContext = await request.newContext();
			Log.info(`Sending GET request for ${description}`);
			const response: APIResponse = await apiContext.get(url, {
                headers: Headers
            });
			Log.info(`Received response with status code ${response.status()}`);
			return response;
		} catch (error) {
			Log.error(`Error sending GET request to ${url}: ${error}`);
			throw error;
		}  
	}

	/**
	 * Sends a POST request to the specified URL with optional body and headers, and returns the Playwright APIResponse.
	 * @param url - The full URL or path to send the POST request to
	 * @param description - A brief description of the request for logging purposes
	 * @param body - Optional body data (object, string, or FormData) to send with the request
	 * @param headers - Optional HTTP headers to include with the request
	 * @returns {Promise<APIResponse>} The Playwright APIResponse object
	 */
	public async sendPOSTRequest(url: string, description: string, Headers?: any, body?: any): Promise<APIResponse> {
		let apiContext: any;
		try {
			apiContext = await request.newContext();			
			Log.info(`Sending POST request for ${description}`);
			const response: APIResponse = await apiContext.post(url, {
                headers: Headers, 
                data: body
            });
			Log.info(`Received response with status code ${response.status()}`);
			return response;
		} catch (error) {
			Log.error(`Error sending POST request to ${url}: ${error}`);
			throw error;
		}
	}

    /**
     * Sends a PUT request to the specified URL with optional body and headers, and returns the Playwright APIResponse.
     * @param url - The full URL or path to send the PUT request to
     * @param description - A brief description of the request for logging purposes
     * @param body - Optional body data (object, string, or FormData) to send with the request
     * @param Headers - Optional HTTP headers to include with the request
     * @returns {Promise<APIResponse>} The Playwright APIResponse object containing the server response
     */
    public async sendPUTRequest(url: string, description: string, Headers?: any, body?: any): Promise<APIResponse> {
		let apiContext: any;
		try {
			apiContext = await request.newContext();			
			Log.info(`Sending PUT request for ${description}`);
			const response: APIResponse = await apiContext.put(url, {
                headers: Headers, 
                data: body
            });
			Log.info(`Received response with status code ${response.status()}`);
			return response;
		} catch (error) {
			Log.error(`Error sending PUT request to ${url}: ${error}`);
			throw error;
		}
	}

    /**
     * Sends a DELETE request to the specified URL with optional body and headers, and returns the Playwright APIResponse.
     * @param url - The full URL or path to send the DELETE request to
     * @param description - A brief description of the request for logging purposes
     * @param body - Optional body data (object, string, or FormData) to send with the request
     * @param Headers - Optional HTTP headers to include with the request
     * @returns {Promise<APIResponse>} The Playwright APIResponse object containing the server response
     */
    public async sendDELETERequest(url: string, description: string, Headers?: any, body?: any): Promise<APIResponse> {
		let apiContext: any;
		try {
			apiContext = await request.newContext();			
			Log.info(`Sending DELETE request for ${description}`);
			const response: APIResponse = await apiContext.delete(url, {
                headers: Headers, 
                data: body
            });
			Log.info(`Received response with status code ${response.status()}`);
			return response;
		} catch (error) {
			Log.error(`Error sending DELETE request to ${url}: ${error}`);
			throw error;
		}
	}

	/**
	 * Sends a PATCH request to the specified URL with optional body and headers, and returns the Playwright APIResponse.
	 * @param url - The full URL or path to send the PATCH request to
	 * @param description - A brief description of the request for logging purposes
	 * @param Headers - Optional HTTP headers to include with the request
	 * @param body - Optional body data (object, string, or FormData) to send with the request
	 * @returns {Promise<APIResponse>} The Playwright APIResponse object containing the server response
	 */
	public async sendPATCHRequest(url: string, description: string, Headers?: any, body?: any): Promise<APIResponse> {
		let apiContext: any;
		try {
			apiContext = await request.newContext();			
			Log.info(`Sending PATCH request for ${description}`);
			const response: APIResponse = await apiContext.patch(url, {
				headers: Headers, 
				data: body
			});
			Log.info(`Received response with status code ${response.status()}`);
			return response;
		} catch (error) {
			Log.error(`Error sending PATCH request to ${url}: ${error}`);
			throw error;
		}	
	}

}
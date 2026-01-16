import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(__dirname, '.env')});

require('dotenv').config({ override: true });

export const STORAGE_STATE = path.join(__dirname, '/tests/state.json');

export default defineConfig({

  projects: [
    
    {
      name: 'setup_chromium',
      testMatch: '**/tests/*setup.ts',
      use: {
        browserName: 'chromium',               
      }
    },

    {
      name: 'e2e ui tests chromium',
      dependencies: ['setup_chromium'],
      testMatch: '**/tests/*.spec.ts',
      use: {
        browserName: 'chromium',   
        storageState: STORAGE_STATE,    
      }      
    }, 
    
    {
      name: 'teardown_chromium',
      dependencies: ['e2e ui tests chromium'],
      testMatch: '**/tests/*teardown.ts',
      use: {
        browserName: 'chromium',              
        storageState: STORAGE_STATE,    
      }      
    },

    // {
    //   name: 'setup_firefox',
    //   testMatch: '**/tests/*.setup.ts',
    //   use: {
    //     browserName: 'firefox',               
    //   }
    // },

    // {
    //   name: 'e2e ui tests firefox',
    //   dependencies: ['setup_firefox'],
    //   testMatch: '**/tests/*.spec.ts',
    //   use: {
    //     browserName: 'firefox',   
    //     storageState: STORAGE_STATE,    
    //   }      
    // }, 
    
    // {
    //   name: 'teardown_firefox',
    //   dependencies: ['e2e ui tests firefox'],
    //   testMatch: '**/tests/*.teardown.ts',
    //   use: {
    //     browserName: 'firefox',              
    //     storageState: STORAGE_STATE,    
    //   }      
    // },

    {
      name: 'API tests',      
      testMatch: '**/tests/*api.test.ts',
      workers: 2,
    }
  ],  
  
  reporter: [['html', {open: 'always'}]],
  
  use: {
    headless: true,    
    screenshot: 'on',
    video: 'retain-on-failure',
  }, 

  workers: 1,
  retries: 2,
});


import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';
import * as http from 'selenium-webdriver/http';
import * as command from 'selenium-webdriver/lib/command';
import * as remote from 'selenium-webdriver/remote';
import { ElementHelper, ProtractorBrowser } from './browser';
import { ElementArrayFinder, ElementFinder } from './element';
import { ProtractorExpectedConditions } from './expectedConditions';
import { ProtractorBy } from './locators';
export declare class Ptor {
    browser: ProtractorBrowser;
    $: (search: string) => ElementFinder;
    $$: (search: string) => ElementArrayFinder;
    element: ElementHelper;
    By: ProtractorBy;
    by: ProtractorBy;
    wrapDriver: (webdriver: webdriver.WebDriver, baseUrl?: string, rootElement?: string, untrackOutstandingTimeouts?: boolean) => ProtractorBrowser;
    ExpectedConditions: ProtractorExpectedConditions;
    ProtractorBrowser: any;
    ElementFinder: any;
    ElementArrayFinder: any;
    ProtractorBy: any;
    ProtractorExpectedConditions: any;
    Actions: typeof webdriver.Actions;
    Browser: typeof webdriver.Browser;
    Builder: typeof webdriver.Builder;
    Button: typeof webdriver.Button;
    Capabilities: typeof webdriver.Capabilities;
    Capability: typeof webdriver.Capability;
    EventEmitter: typeof webdriver.EventEmitter;
    FileDetector: typeof webdriver.FileDetector;
    Key: typeof webdriver.Key;
    Session: typeof webdriver.Session;
    WebDriver: typeof webdriver.WebDriver;
    WebElement: typeof webdriver.WebElement;
    WebElementPromise: typeof webdriver.WebElementPromise;
    error: typeof webdriver.error;
    logging: typeof webdriver.logging;
    promise: typeof webdriver.promise;
    until: typeof webdriver.until;
    Command: typeof command.Command;
    CommandName: command.ICommandName;
    utils: {
        firefox: typeof firefox;
        http: typeof http;
        remote: typeof remote;
        chrome: typeof chrome;
    };
}
export declare let protractor: Ptor;

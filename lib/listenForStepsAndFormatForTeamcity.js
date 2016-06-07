function teamCityFormatter() {

    this.registerHandler("BeforeFeature", handleBeforeFeature);

    this.registerHandler("AfterFeature", handleAfterFeature);

    this.registerHandler("BeforeScenario", handleBeforeScenario);

    this.registerHandler("AfterScenario", handleAfterScenario);

    this.registerHandler("StepResult", handleStepResult);

}
module.exports = teamCityFormatter;

function handleStepResult(event, callback) {
    var stepResult = event.getPayloadItem("stepResult");

    var step = stepResult.getStep();

    var location = step.getName() + " line " + step.getLine();

    if (stepResult.getStatus() === "failed" || stepResult.getStatus() === "ambiguous") {
        var failureMessage = stepResult.getFailureException();
        if (failureMessage) {
            process.stderr.write("##teamcity[testFailed name='" + escape(location) +
            "' message='Error during " + escape(location) +
            "' details='" + escape(failureMessage.stack || failureMessage) + "']\n");
        }
        return callback();
    }

    if (location !== "undefined line undefined") {
        process.stderr.write(location + "\n");
    }

    callback();
}

function handleBeforeFeature(event, callback) {
    var feature = event.getPayloadItem("feature");
    process.stderr.write("##teamcity[testSuiteStarted name='" + escape(feature.getName()) + "']\n");
    callback();
}

function handleAfterFeature(event, callback) {
    var feature = event.getPayloadItem("feature");
    process.stdout.write("##teamcity[testSuiteFinished name='" + escape(feature.getName()) + "']\n");
    callback();
}

function handleBeforeScenario(event, callback) {
    var scenario = event.getPayloadItem("scenario");
    process.stderr.write("##teamcity[testStarted name='" + escape(scenario.getName()) + "' captureStandardOutput='true']\n");
    callback();
}

function handleAfterScenario(event, callback) {
    var scenario = event.getPayloadItem("scenario");
    process.stderr.write("##teamcity[testFinished name='" + escape(scenario.getName()) + "']\n");
    callback();
}

//according to: https://confluence.jetbrains.com/display/TCD7/Build+Script+Interaction+with+TeamCity
function escape(string) {
    return string
        .replace(/\|/g, '||')
        .replace(/'/g, "|'")
        .replace(/\n/g, '|n')
        .replace(/\r/g, '|r')
        .replace(/\[/g, '|[')
        .replace(/\]/g, '|]');
}

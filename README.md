# Boris' Dareboost / Speed Analysis API Helpers

A set of helpers I use to manipulate Dareboost / Speed Analysis API, using node.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [git](https://git-scm.com/)
* node 8.11.3+ (may work on minor version but I've not tested)

For node, I recommend using [nvm](https://github.com/creationix/nvm) to switch from one node version to another.

### Installing

You will need to start by cloning the repository:

```
git clone https://github.com/borisschapira/dareboost-api-helpers.git
```

Then enter the folder and install the project using yarn:

```
npm install
```

### API Token

You will need a [Dareboost](https://www.dareboost.com/en/profile/api) or [Speed Analysis](https://app.contentsquare.com/#/speed-analysis/profile/api) API token (you need to be a customer) right before calling the helpers.

## Usage

### Export Active Monitors

To export a user's active tracking configuration:

```
API_TOKEN='your_api_token' npm run page:monitor
```

### Export the page statistics


To export a user's active tracking general statistics (the mean or percentiles of the active monitors for Weights, TTFB, Start Render & Speed Index):

```
API_TOKEN='your_api_token' npm run page:statistics
```

### Export the pages values


To export a more detailed report of your active tracking metrics, you can use:

```
API_TOKEN='your_api_token' npm run page:monitor:average
```

If you want the value of percentiles instead of the average (mathematical mean), you can use the PERCENTILE parameter. To get median values (50th percentile), use:

```
PERCENTILE=50 API_TOKEN='your_api_token' npm run page:monitor:average
```


### Export the most common advice

To export the tips that came up most often:

```
API_TOKEN='your_api_token' npm run page:common-tips
```

**Additionnal parameters**

You can use PREFIX to define a prefix for the exported files and CSV_SEPARATOR to change the default CSV separator (tab) by something else (a comma, for example):

```
PREFIX='Export' CSV_SEPARATOR="," API_TOKEN='your_api_token' npm run page:monitors
```

For

## Running the tests

Hey! Hum… I'm gonna write some tests. Some day. In the near future.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Boris Schapira** - *Initial work* - [borisschapira](https://github.com/borisschapira)

See also the list of [contributors](https://github.com/borisschapira/dareboost-api-helpers/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

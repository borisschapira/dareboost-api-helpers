# Boris' Dareboost API Helpers

A set of helpers I use to manipulate Dareboost API, using node.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [git](https://git-scm.com/)
* node 8.11.3+ (may work on minor version but I've not tested)
* [yarn package manager](https://yarnpkg.com/)

For node, I recommend using [nvm](https://github.com/creationix/nvm) to switch from one node version to another.

### Installing

You will need to start by cloning the repository:

```
git clone https://github.com/borisschapira/dareboost-api-helpers.git
```

Then enter the folder and install the project using yarn:

```
yarn install
```

### Using the helpers

From now on, there is only one helper that exports a user's active tracking configuration to JSON and CSV. Don't forget to set [your Dareboost API token](https://www.dareboost.com/en/profile/api) (you need to be a customer, see [Dareboost's offers](https://www.dareboost.com/en/offers#gppufs)) right before calling the helper.

```
DB_API_TOKEN='your_api_token' yarn output-tracking-conf
```


## Running the tests

Hey! Hum… I'm gonna write some tests. Some day. In the near future.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

Please ensure that your code does not triggered any linting alert:

```
yarn lint
```

## Authors

* **Boris Schapira** - *Initial work* - [borisschapira](https://github.com/borisschapira)

See also the list of [contributors](https://github.com/borisschapira/dareboost-api-helpers/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

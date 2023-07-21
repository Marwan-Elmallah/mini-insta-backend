const headers = ["body", "params", "query"]

const validator = (Schema) => {
    let arrayOfError = []
    return (req, res, next) => {

        headers.forEach((key) => {
            if (Schema[key]) {
                let validateShema = Schema[key].validate(req[key])
                if (validateShema.error) {
                    arrayOfError.push(validateShema.error.details)
                }
            }
        })
        if (arrayOfError.length > 0) {
            res.status(400).json({ message: "Validation Error", arrayOfError })
        } else {
            next()
        }
    }
}

module.exports = validator
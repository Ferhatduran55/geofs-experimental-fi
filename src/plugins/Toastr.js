class Toastr {
    constructor(options = null) {
        this.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        this._load(options ?? this.options)
    }

    notify(type, content, options = null) {
        if (options) this._load(options)
        toastr[type](content)
        this._unload()
    }

    _load(options) {
        $.each(options, (key, value) => toastr.options[key] = value)
    }

    _unload() {
        toastr.options = this.options
    }
}
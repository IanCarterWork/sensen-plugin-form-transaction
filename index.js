export default class SensenFormTransaction {
    constructor(form) {
        this.form = form;
        this.elements = form.elements;
        this.data = new FormData();
        this.records = {};
        this.results = {};
        this.recolts().consolidated();
    }
    static state(form) {
        return new SensenFormTransaction(form);
    }
    recolts() {
        Object.values(this.elements).map(input => {
            if (input instanceof HTMLInputElement ||
                input instanceof HTMLSelectElement ||
                input instanceof HTMLTextAreaElement) {
                const name = (input.getAttribute('name') || '');
                const type = (input.getAttribute('type') || 'text').toLowerCase();
                const multipleTarget = this.form.querySelectorAll(`${input.tagName}[type="${type}"][name="${name}"]`);
                if (multipleTarget.length > 1 ||
                    ((input instanceof HTMLSelectElement)
                        && input.multiple)) {
                    this.records[name] = this.records[name] || [];
                    // @ts-ignore
                    this.records[name].push(input);
                }
                else {
                    this.records[name] = input;
                }
            }
        });
        return this;
    }
    consolidated() {
        const records = Object.entries(this.records);
        if (records.length) {
            records.map($ => {
                if (Array.isArray($[1])) {
                    $[1].map(input => {
                        const name = input.getAttribute('name') || 'undefined';
                        if ('files' in input) {
                            Object.values(input.files || {}).map(file => {
                                this.data.append(name, file, file.name || undefined);
                                this.results[name] = file;
                            });
                        }
                        else if (Array.isArray(input)) {
                            Object.values(input || {}).map(inp => {
                                this.data.append(name, inp.value);
                                this.results[name] = inp.value;
                            });
                        }
                        else {
                            this.data.append(name, input.value);
                            this.results[name] = input.value;
                        }
                    });
                }
                else if (Array.isArray($[1])) {
                    Object.values($[1] || {}).map((inp) => {
                        const input = inp;
                        const name = input.getAttribute('name') || 'undefined';
                        this.data.append(name, input.value);
                        this.results[name] = input.value;
                    });
                }
                else {
                    const input = $[1];
                    const name = input.getAttribute('name') || 'undefined';
                    this.data.append(name, input.value);
                    this.results[name] = input.value;
                }
            });
        }
        return this;
    }
}

import {
    AbstractBNodeSerializer,
    RDFLiteral,
    RDFQuad,
    RDFResourceIRI
} from '../../main/annotations/interfaces/AbstractBNodeSerializer';
import {RdfBean} from '../../main/annotations/RdfBean';
import {RdfNamespaces} from '../../main/annotations/RdfNamespaces';
import {RdfProperty} from '../../main/annotations/RdfProperty';
import {RdfSubject} from '../../main/annotations/RdfSubject';

export interface UAddress {
    streetName: string;
    streetNumber: number;
    isRegistered: boolean;
}

export class AddressSerializer extends AbstractBNodeSerializer {

    constructor() {
        super();
        this.addPrefix('address', 'http://example.com/Address/');
    }

    serialize(value: Object): RDFQuad[] {
        const quads: RDFQuad[] = [];

        Object.keys(value).forEach(key => {
            const predicate: RDFResourceIRI = this.makePredicate(`address:${key}`);
            let obj: RDFLiteral;
            // If value is not a number
            // if (isNaN(value[key])) {
            if (typeof (value[key]) === 'string') {
                obj = this.makeLiteralWithDataType(value[key], 'xsd:string');
            }
            // If value is boolean
            if (typeof (value[key]) === 'boolean') {
                obj = this.makeLiteralWithDataType(value[key], 'xsd:boolean');
            }
            // if value is number
            if (typeof (value[key]) === 'number') {
                obj = this.makeLiteralWithDataType(value[key], 'xsd:integer');
            }
            quads.push(this.createQuad(this.subject, predicate, obj));
        });

        return quads;
    }

}

@RdfNamespaces({
    foaf: 'http://xmlns.com/foaf/0.1/',
    user: 'http://example.com/User/'
})
@RdfBean('foaf:User')
export class UserJsonObject {
    @RdfSubject('user')
    public name: string;

    @RdfProperty({prop: 'user:address', serializer: AddressSerializer})
    public address: UAddress;
}

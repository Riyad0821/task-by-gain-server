const GraphQLSchema = require("graphql").GraphQLSchema;
const GraphQLObjectType = require("graphql").GraphQLObjectType;
const GraphQLString = require("graphql").GraphQLString;
const GraphQLList = require("graphql").GraphQLList;
const GraphQLNonNull = require("graphql").GraphQLNonNull;
const GraphQLID = require("graphql").GraphQLID;
const StudentModel = require("../models/Student");
const SubjectModel = require("../models/Subject");

const studentType = new GraphQLObjectType({
    name: "student",
    fields: () => ({
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        dob: {
            type: GraphQLString
        },
        subjects: {
            type: new GraphQLList(subjectType),
            resolve: async function (student) {
                const subjects = await SubjectModel.find({ students: student._id });
                return subjects;
            }
        }
    })
});

const subjectType = new GraphQLObjectType({
    name: "subject",
    fields: () => ({
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        students: {
            type: new GraphQLList(studentType),
            resolve: async function (subject) {
                const students = await StudentModel.find({ subjects: subject._id });
                return students;
            }
        }
    }),
});

const queryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        students: {
            type: new GraphQLList(studentType),
            resolve(parent, args) {
                return StudentModel.find();
            }
        },
        student: {
            type: studentType,
            args: {
                id: {
                    name: "_id",
                    type: GraphQLID
                }
            },
            resolve: (root, args) => StudentModel.findById(args.id)
        },
        subjects: {
            type: new GraphQLList(subjectType),
            resolve(parent, args) {
                return SubjectModel.find();
            }
        },
        subject: {
            type: subjectType,
            args: {
                id: {
                    name: "_id",
                    type: GraphQLID
                }
            },
            resolve: (root, args) => SubjectModel.findById(args.id)
        }
    })
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        addStudent: {
            type: studentType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                phone: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                dob: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, args) => {
                let student = new StudentModel({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    dob: args.dob
                });
                return student.save();
            }
        },
        addSubjectToStudent: {
            type: studentType,
            args: {
                studentId: {
                    type: new GraphQLNonNull(GraphQLID)
                },
                subjectId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (root, args) => {
                const student = await StudentModel.findById(args.studentId);
                const subject = await SubjectModel.findById(args.subjectId);
                student.subjects.push(subject);
                subject.students.push(student);
                await student.save();
                await subject.save();
                return student;

            }
        },
        deleteSubjectFromStudent: {
            type: studentType,
            args: {
                studentId: {
                    type: new GraphQLNonNull(GraphQLID)
                },
                subjectId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (root, args) => {
                const student = await StudentModel.findById(args.studentId);
                const subject = await SubjectModel.findById(args.subjectId);
                student.subjects.pull(subject);
                subject.students.pull(student);
                await student.save();
                await subject.save();
                return student;
            }
        },
        updateStudent: {
            type: studentType,
            args: {
                id: {
                    name: "_id",
                    type: new GraphQLNonNull(GraphQLID)
                },
                name: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                phone: {
                    type: GraphQLString
                },
                dob: {
                    type: GraphQLString
                }
            },
            resolve: (root, args) => {
                return StudentModel.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        dob: args.dob
                    }
                }, {
                    new: true
                });
            }
        },
        deleteStudent: {
            type: studentType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: (root, args) => {
                return StudentModel.findByIdAndRemove(args.id);
            }
        },
        addSubject: {
            type: subjectType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, args) => {
                let subject = new SubjectModel({
                    name: args.name
                });
                return subject.save();
            }
        },
        updateSubject: {
            type: subjectType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                },
                name: {
                    type: GraphQLString
                }
            },
            resolve: (root, args) => {
                return SubjectModel.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name
                    }
                }, {
                    new: true
                });
            }
        },
        deleteSubject: {
            type: subjectType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: (root, args) => {
                return SubjectModel.findByIdAndRemove(args.id);
            }
        },
    })
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
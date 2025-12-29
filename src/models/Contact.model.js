module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define('Contact', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('new', 'in_progress', 'resolved', 'spam'),
            defaultValue: 'new',
        },
    }, {
        tableName: 'contacts',
        timestamps: true,
        underscored: true,
    });

    return Contact;
};

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductItem = ({ product, onEdit, onDelete, onAddToCart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.code}>{product.code}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        {onAddToCart && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.addButton]} 
            onPress={() => onAddToCart(product)}
          >
            <MaterialIcons name="add-shopping-cart" size={20} color="white" />
          </TouchableOpacity>
        )}
        
        {onEdit && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => onEdit(product)}
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={() => onDelete(product.id)}
          >
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  infoContainer: {
    flex: 1,
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});

export default ProductItem;

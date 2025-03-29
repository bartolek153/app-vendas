import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { 
  addProduct, 
  updateProduct, 
  getProductById 
} from '../services/productService';

const ProductFormScreen = ({ route, navigation }) => {
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    price: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Verificar se estamos editando um produto existente
  const editMode = route.params?.product !== undefined;
  const productId = editMode ? route.params.product.id : null;
  
  // Carregar dados do produto se estiver em modo de edição
  useEffect(() => {
    if (editMode) {
      const product = route.params.product;
      setFormData({
        code: product.code,
        description: product.description,
        price: product.price.toString()
      });
    }
  }, [editMode, route.params]);
  
  // Atualizar campo do formulário
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Limpar erro do campo quando o usuário digita
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else {
      const price = parseFloat(formData.price.replace(',', '.'));
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Preço deve ser um número positivo';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Salvar produto
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Converter preço para número
      const priceValue = parseFloat(formData.price.replace(',', '.'));
      
      const productData = {
        code: formData.code,
        description: formData.description,
        price: priceValue
      };
      
      if (editMode) {
        // Atualizar produto existente
        productData.id = productId;
        await updateProduct(productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        // Adicionar novo produto
        await addProduct(productData);
        Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro', 
        'Ocorreu um erro ao salvar o produto. ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          {/* Campo de Código */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código *</Text>
            <TextInput
              style={[styles.input, errors.code ? styles.inputError : null]}
              value={formData.code}
              onChangeText={(text) => handleChange('code', text)}
              placeholder="Digite o código do produto"
              maxLength={20}
            />
            {errors.code ? (
              <Text style={styles.errorText}>{errors.code}</Text>
            ) : null}
          </View>
          
          {/* Campo de Descrição */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, errors.description ? styles.inputError : null]}
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              placeholder="Digite a descrição do produto"
              maxLength={100}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : null}
          </View>
          
          {/* Campo de Preço */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preço Unitário (R$) *</Text>
            <TextInput
              style={[styles.input, errors.price ? styles.inputError : null]}
              value={formData.price}
              onChangeText={(text) => handleChange('price', text)}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
            {errors.price ? (
              <Text style={styles.errorText}>{errors.price}</Text>
            ) : null}
          </View>
          
          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductFormScreen;
